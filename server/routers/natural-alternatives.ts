import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { naturalAlternatives } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const naturalAlternativesRouter = router({
  /**
   * Get all natural alternatives with optional filtering
   */
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        verified: z.boolean().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const { category, search, verified, limit, offset } = input;

      let query = db.select().from(naturalAlternatives);

      const conditions = [];
      if (category) {
        conditions.push(eq(naturalAlternatives.category, category as any));
      }
      if (search) {
        conditions.push(like(naturalAlternatives.name, `%${search}%`));
      }
      if (verified !== undefined) {
        conditions.push(eq(naturalAlternatives.verified, verified));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const items = await query.limit(limit).offset(offset);
      return items;
    }),

  /**
   * Get single alternative by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const item = await db
        .select()
        .from(naturalAlternatives)
        .where(eq(naturalAlternatives.id, input.id))
        .limit(1);
      return item[0] || null;
    }),

  /**
   * Get alternatives by category
   */
  getByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const items = await db
        .select()
        .from(naturalAlternatives)
        .where(eq(naturalAlternatives.category, input.category as any))
        .limit(input.limit);
      return items;
    }),

  /**
   * Get alternatives suitable for specific pet
   */
  getForPet: publicProcedure
    .input(
      z.object({
        species: z.enum(["cat", "dog"]),
        breed: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const items = await db
        .select()
        .from(naturalAlternatives)
        .where(eq(naturalAlternatives.verified, true));

      // Filter by species compatibility
      return items.filter((item) => {
        const suitable = item.suitableFor as any;
        if (!suitable) return true;
        return (
          suitable.includes(input.species) ||
          suitable.includes("both") ||
          (input.breed && suitable.includes(input.breed))
        );
      });
    }),

  /**
   * Get top-rated alternatives
   */
  getTopRated: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const items = await db
        .select()
        .from(naturalAlternatives)
        .where(eq(naturalAlternatives.verified, true))
        .limit(input.limit);

      return items.sort((a, b) => {
        const ratingA = parseFloat(a.rating?.toString() || "0");
        const ratingB = parseFloat(b.rating?.toString() || "0");
        return ratingB - ratingA;
      });
    }),

  /**
   * Create new alternative (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        nameAr: z.string().optional(),
        category: z.string(),
        description: z.string(),
        descriptionAr: z.string().optional(),
        benefits: z.array(z.string()).optional(),
        benefitsAr: z.array(z.string()).optional(),
        ingredients: z.string().optional(),
        ingredientsAr: z.string().optional(),
        suitableFor: z.array(z.string()).optional(),
        price: z.number().optional(),
        supplier: z.string().optional(),
        supplierUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        certifications: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db.insert(naturalAlternatives).values({
        name: input.name,
        nameAr: input.nameAr,
        category: input.category as any,
        description: input.description,
        descriptionAr: input.descriptionAr,
        benefits: input.benefits,
        benefitsAr: input.benefitsAr,
        ingredients: input.ingredients,
        ingredientsAr: input.ingredientsAr,
        suitableFor: input.suitableFor,
        price: input.price ? parseFloat(input.price.toString()) : null,
        supplier: input.supplier,
        supplierUrl: input.supplierUrl,
        imageUrl: input.imageUrl,
        certifications: input.certifications,
      });

      return result;
    }),

  /**
   * Update alternative (admin only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        rating: z.number().optional(),
        verified: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.description) updates.description = input.description;
      if (input.price) updates.price = input.price;
      if (input.rating !== undefined) updates.rating = input.rating;
      if (input.verified !== undefined) updates.verified = input.verified;

      const result = await db
        .update(naturalAlternatives)
        .set(updates)
        .where(eq(naturalAlternatives.id, input.id));

      return result;
    }),

  /**
   * Search alternatives
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let query = db.select().from(naturalAlternatives);

      const conditions = [like(naturalAlternatives.name, `%${input.query}%`)];

      if (input.category) {
        conditions.push(eq(naturalAlternatives.category, input.category as any));
      }

      const items = await query.where(and(...conditions)).limit(20);
      return items;
    }),
});
