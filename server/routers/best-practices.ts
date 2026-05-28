import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { bestPractices } from "../../drizzle/schema";
import { eq, and, like } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const bestPracticesRouter = router({
  /**
   * Get all best practices with optional filtering
   */
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        species: z.string().optional(),
        expertReview: z.boolean().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const { category, species, expertReview, limit, offset } = input;

      let query = db.select().from(bestPractices);

      const conditions = [];
      if (category) {
        conditions.push(eq(bestPractices.category, category as any));
      }
      if (expertReview !== undefined) {
        conditions.push(eq(bestPractices.expertReview, expertReview));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const items = await query.limit(limit).offset(offset);

      // Filter by species if provided
      if (species) {
        return items.filter((item) => {
          const speciesList = item.species as any;
          if (!speciesList) return true;
          return speciesList.includes(species) || speciesList.includes("both");
        });
      }

      return items;
    }),

  /**
   * Get single best practice by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const item = await db
        .select()
        .from(bestPractices)
        .where(eq(bestPractices.id, input.id))
        .limit(1);
      return item[0] || null;
    }),

  /**
   * Get practices by category
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
        .from(bestPractices)
        .where(eq(bestPractices.category, input.category as any))
        .limit(input.limit);
      return items;
    }),

  /**
   * Get expert-reviewed practices
   */
  getExpertReviewed: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let query = db
        .select()
        .from(bestPractices)
        .where(eq(bestPractices.expertReview, true));

      if (input.category) {
        query = query.where(eq(bestPractices.category, input.category as any));
      }

      const items = await query.limit(input.limit);
      return items;
    }),

  /**
   * Search best practices
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

      let query = db.select().from(bestPractices);

      const conditions = [like(bestPractices.title, `%${input.query}%`)];

      if (input.category) {
        conditions.push(eq(bestPractices.category, input.category as any));
      }

      const items = await query.where(and(...conditions)).limit(20);
      return items;
    }),

  /**
   * Get practices for specific pet species
   */
  getForSpecies: publicProcedure
    .input(
      z.object({
        species: z.enum(["cat", "dog"]),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let query = db.select().from(bestPractices);

      if (input.category) {
        query = query.where(eq(bestPractices.category, input.category as any));
      }

      const items = await query.limit(20);

      // Filter by species
      return items.filter((item) => {
        const speciesList = item.species as any;
        if (!speciesList) return true;
        return speciesList.includes(input.species) || speciesList.includes("both");
      });
    }),

  /**
   * Get breed-specific practices
   */
  getBreedSpecific: publicProcedure
    .input(
      z.object({
        breed: z.string(),
        species: z.enum(["cat", "dog"]),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const items = await db.select().from(bestPractices).limit(50);

      // Filter by breed and species
      return items.filter((item) => {
        const speciesList = item.species as any;
        const speciesMatch =
          !speciesList ||
          speciesList.includes(input.species) ||
          speciesList.includes("both");

        const breedMatch =
          !item.breedSpecific ||
          item.breedSpecific.toLowerCase() === input.breed.toLowerCase();

        return speciesMatch && breedMatch;
      });
    }),

  /**
   * Create new best practice (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        titleAr: z.string().optional(),
        category: z.string(),
        content: z.string(),
        contentAr: z.string().optional(),
        keyPoints: z.array(z.string()).optional(),
        keyPointsAr: z.array(z.string()).optional(),
        species: z.array(z.string()).optional(),
        breedSpecific: z.string().optional(),
        source: z.string().optional(),
        references: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db.insert(bestPractices).values({
        title: input.title,
        titleAr: input.titleAr,
        category: input.category as any,
        content: input.content,
        contentAr: input.contentAr,
        keyPoints: input.keyPoints,
        keyPointsAr: input.keyPointsAr,
        species: input.species,
        breedSpecific: input.breedSpecific,
        source: input.source,
        references: input.references,
      });

      return result;
    }),

  /**
   * Update best practice (admin only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        expertReview: z.boolean().optional(),
        reviewedBy: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const updates: any = {};
      if (input.title) updates.title = input.title;
      if (input.content) updates.content = input.content;
      if (input.expertReview !== undefined) updates.expertReview = input.expertReview;
      if (input.reviewedBy) updates.reviewedBy = input.reviewedBy;

      const result = await db
        .update(bestPractices)
        .set(updates)
        .where(eq(bestPractices.id, input.id));

      return result;
    }),

  /**
   * Get practices by source (WHO, AAFCO, FEDIAF, etc.)
   */
  getBySource: publicProcedure
    .input(
      z.object({
        source: z.string(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const items = await db.select().from(bestPractices).limit(50);

      return items
        .filter((item) => item.source?.toLowerCase().includes(input.source.toLowerCase()))
        .slice(0, input.limit);
    }),
});
