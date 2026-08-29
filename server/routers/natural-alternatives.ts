import { router, protectedProcedure, publicProcedure, adminProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { naturalAlternatives } from "../../drizzle/schema";
import { eq, and, like } from "drizzle-orm";
import { z } from "zod";

export const naturalAlternativesRouter = router({
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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { category, search, verified, limit, offset } = input;
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

      const query = conditions.length > 0
        ? db.select().from(naturalAlternatives).where(and(...conditions))
        : db.select().from(naturalAlternatives);

      return await query.limit(limit).offset(offset);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db
        .select()
        .from(naturalAlternatives)
        .where(eq(naturalAlternatives.id, input.id))
        .limit(1);

      return result.length ? result[0] : null;
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return await db
        .select()
        .from(naturalAlternatives)
        .where(eq(naturalAlternatives.category, input.category as any))
        .limit(input.limit);
    }),

  search: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return await db
        .select()
        .from(naturalAlternatives)
        .where(like(naturalAlternatives.name, `%${input.query}%`))
        .limit(input.limit);
    }),

  create: adminProcedure
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
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(naturalAlternatives).values({
        name: input.name,
        nameAr: input.nameAr,
        category: input.category as any,
        description: input.description,
        descriptionAr: input.descriptionAr,
        benefits: input.benefits as any,
        benefitsAr: input.benefitsAr as any,
        ingredients: input.ingredients,
        ingredientsAr: input.ingredientsAr,
        suitableFor: input.suitableFor as any,
        price: input.price as any,
        supplier: input.supplier,
        supplierUrl: input.supplierUrl,
        imageUrl: input.imageUrl,
        certifications: input.certifications as any,
        verified: false,
      });

      return { success: true };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        verified: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.category) updates.category = input.category;
      if (input.description) updates.description = input.description;
      if (input.price) updates.price = input.price;
      if (input.verified !== undefined) updates.verified = input.verified;

      await db.update(naturalAlternatives).set(updates).where(eq(naturalAlternatives.id, input.id));
      return { success: true };
    }),
});
