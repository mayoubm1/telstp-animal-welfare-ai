import { router, protectedProcedure, publicProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { bestPractices } from "../../drizzle/schema";
import { eq, and, like } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const bestPracticesRouter = router({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const conditions = [];
      if (input.category) conditions.push(eq(bestPractices.category, input.category as any));
      const query = conditions.length > 0 ? db.select().from(bestPractices).where(and(...conditions)) : db.select().from(bestPractices);
      return await query.limit(input.limit).offset(input.offset);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const items = await db.select().from(bestPractices).where(eq(bestPractices.id, input.id)).limit(1);
      return items[0] || null;
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.select().from(bestPractices).where(eq(bestPractices.category, input.category as any)).limit(input.limit);
    }),

  getExpertReviewed: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const conditions = [eq(bestPractices.expertReview, true)];
      if (input.category) conditions.push(eq(bestPractices.category, input.category as any));
      return await db.select().from(bestPractices).where(and(...conditions)).limit(input.limit);
    }),

  search: publicProcedure
    .input(z.object({ query: z.string(), category: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const conditions = [like(bestPractices.title, `%${input.query}%`)];
      if (input.category) conditions.push(eq(bestPractices.category, input.category as any));
      return await db.select().from(bestPractices).where(and(...conditions)).limit(20);
    }),

  getForSpecies: publicProcedure
    .input(z.object({ species: z.enum(["cat", "dog"]), category: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const conditions = [];
      if (input.category) conditions.push(eq(bestPractices.category, input.category as any));
      const items = conditions.length > 0 ? await db.select().from(bestPractices).where(and(...conditions)).limit(20) : await db.select().from(bestPractices).limit(20);
      return items.filter((item) => {
        const speciesList = item.species as any;
        if (!speciesList) return true;
        return speciesList.includes(input.species) || speciesList.includes("both");
      });
    }),

  getBreedSpecific: publicProcedure
    .input(z.object({ breed: z.string(), species: z.enum(["cat", "dog"]) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const items = await db.select().from(bestPractices).limit(50);
      return items.filter((item) => {
        const speciesList = item.species as any;
        const speciesMatch = !speciesList || speciesList.includes(input.species) || speciesList.includes("both");
        const breedMatch = !item.breedSpecific || item.breedSpecific.toLowerCase() === input.breed.toLowerCase();
        return speciesMatch && breedMatch;
      });
    }),

  create: adminProcedure
    .input(z.object({ title: z.string(), titleAr: z.string().optional(), category: z.string(), content: z.string(), contentAr: z.string().optional(), keyPoints: z.array(z.string()).optional(), keyPointsAr: z.array(z.string()).optional(), species: z.array(z.string()).optional(), breedSpecific: z.string().optional(), source: z.string().optional(), references: z.array(z.string()).optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.insert(bestPractices).values({ title: input.title, titleAr: input.titleAr, category: input.category as any, content: input.content, contentAr: input.contentAr, keyPoints: input.keyPoints, keyPointsAr: input.keyPointsAr, species: input.species, breedSpecific: input.breedSpecific, source: input.source, references: input.references });
    }),

  update: adminProcedure
    .input(z.object({ id: z.number(), title: z.string().optional(), content: z.string().optional(), expertReview: z.boolean().optional(), reviewedBy: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const updates: any = {};
      if (input.title) updates.title = input.title;
      if (input.content) updates.content = input.content;
      if (input.expertReview !== undefined) updates.expertReview = input.expertReview;
      if (input.reviewedBy) updates.reviewedBy = input.reviewedBy;
      return await db.update(bestPractices).set(updates).where(eq(bestPractices.id, input.id));
    }),

  getBySource: publicProcedure
    .input(z.object({ source: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const items = await db.select().from(bestPractices).limit(50);
      return items.filter((item) => item.source?.toLowerCase().includes(input.source.toLowerCase())).slice(0, input.limit);
    }),
});
