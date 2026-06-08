import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { trainingPrograms, trainingProgress } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const trainingProgramsRouter = router({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const conditions = [];
      if (input.category) conditions.push(eq(trainingPrograms.category, input.category as any));
      const items = conditions.length > 0 ? await db.select().from(trainingPrograms).where(and(...conditions)).limit(input.limit) : await db.select().from(trainingPrograms).limit(input.limit);
      return items;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const items = await db.select().from(trainingPrograms).where(eq(trainingPrograms.id, input.id)).limit(1);
      return items[0] || null;
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.select().from(trainingPrograms).where(eq(trainingPrograms.category, input.category as any)).limit(input.limit);
    }),

  getByDifficulty: publicProcedure
    .input(z.object({ difficulty: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.select().from(trainingPrograms).where(eq(trainingPrograms.difficulty, input.difficulty as any)).limit(input.limit);
    }),

  startProgram: protectedProcedure
    .input(z.object({ petId: z.number(), programId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.insert(trainingProgress).values({ petId: input.petId, programId: input.programId, userId: parseInt(ctx.user.id), status: "in_progress" });
    }),

  getProgress: protectedProcedure
    .input(z.object({ petId: z.number(), programId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const items = await db.select().from(trainingProgress).where(and(eq(trainingProgress.userId, parseInt(ctx.user.id)), eq(trainingProgress.petId, input.petId), eq(trainingProgress.programId, input.programId))).limit(1);
      return items[0] || null;
    }),

  logActivity: protectedProcedure
    .input(z.object({ progressId: z.number(), activity: z.string(), date: z.date() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const progress = await db.select().from(trainingProgress).where(eq(trainingProgress.id, input.progressId)).limit(1);
      if (!progress[0]) throw new TRPCError({ code: "NOT_FOUND" });
      const logs = (progress[0].dailyLogs as any) || [];
      logs.push({ date: input.date, activity: input.activity });
      return await db.update(trainingProgress).set({ dailyLogs: logs }).where(eq(trainingProgress.id, input.progressId));
    }),

  completeProgram: protectedProcedure
    .input(z.object({ progressId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.update(trainingProgress).set({ status: "completed", completionDate: new Date() }).where(eq(trainingProgress.id, input.progressId));
    }),

  pauseProgram: protectedProcedure
    .input(z.object({ progressId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.update(trainingProgress).set({ status: "paused" }).where(eq(trainingProgress.id, input.progressId));
    }),

  resumeProgram: protectedProcedure
    .input(z.object({ progressId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return await db.update(trainingProgress).set({ status: "in_progress" }).where(eq(trainingProgress.id, input.progressId));
    }),
});
