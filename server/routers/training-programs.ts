import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { trainingPrograms, trainingProgress } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const trainingProgramsRouter = router({
  /**
   * Get all training programs
   */
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        difficulty: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const { category, difficulty, limit, offset } = input;

      let query = db.select().from(trainingPrograms);

      const conditions = [];
      if (category) {
        conditions.push(eq(trainingPrograms.category, category as any));
      }
      if (difficulty) {
        conditions.push(eq(trainingPrograms.difficulty, difficulty as any));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const items = await query.limit(limit).offset(offset);
      return items;
    }),

  /**
   * Get single program by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const item = await db
        .select()
        .from(trainingPrograms)
        .where(eq(trainingPrograms.id, input.id))
        .limit(1);
      return item[0] || null;
    }),

  /**
   * Get programs by category
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
        .from(trainingPrograms)
        .where(eq(trainingPrograms.category, input.category as any))
        .limit(input.limit);
      return items;
    }),

  /**
   * Get programs by difficulty level
   */
  getByDifficulty: publicProcedure
    .input(
      z.object({
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const items = await db
        .select()
        .from(trainingPrograms)
        .where(eq(trainingPrograms.difficulty, input.difficulty))
        .limit(input.limit);
      return items;
    }),

  /**
   * Start training program for a pet
   */
  startProgram: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        programId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if program exists
      const program = await db
        .select()
        .from(trainingPrograms)
        .where(eq(trainingPrograms.id, input.programId))
        .limit(1);

      if (!program.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Training program not found" });
      }

      // Create training progress record
      const result = await db.insert(trainingProgress).values({
        petId: input.petId,
        userId: ctx.user!.id,
        programId: input.programId,
        status: "in_progress",
      });

      return result;
    }),

  /**
   * Get pet's training progress
   */
  getProgress: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        programId: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let query = db
        .select()
        .from(trainingProgress)
        .where(
          and(
            eq(trainingProgress.petId, input.petId),
            eq(trainingProgress.userId, ctx.user!.id)
          )
        );

      if (input.programId) {
        query = query.where(eq(trainingProgress.programId, input.programId));
      }

      const items = await query;
      return items;
    }),

  /**
   * Log daily training activity
   */
  logActivity: protectedProcedure
    .input(
      z.object({
        progressId: z.number(),
        date: z.string(),
        notes: z.string(),
        success: z.boolean(),
        stepCompleted: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get current progress
      const progress = await db
        .select()
        .from(trainingProgress)
        .where(eq(trainingProgress.id, input.progressId))
        .limit(1);

      if (!progress.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Training progress not found" });
      }

      const currentLogs = (progress[0].dailyLogs as any) || [];
      const newLog = {
        date: input.date,
        notes: input.notes,
        success: input.success,
      };

      currentLogs.push(newLog);

      // Update progress with new log
      const updates: any = {
        dailyLogs: currentLogs,
      };

      if (input.stepCompleted !== undefined) {
        updates.currentStep = input.stepCompleted;
      }

      const result = await db
        .update(trainingProgress)
        .set(updates)
        .where(eq(trainingProgress.id, input.progressId));

      return result;
    }),

  /**
   * Complete training program
   */
  completeProgram: protectedProcedure
    .input(
      z.object({
        progressId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .update(trainingProgress)
        .set({
          status: "completed",
          completionDate: new Date(),
        })
        .where(eq(trainingProgress.id, input.progressId));

      return result;
    }),

  /**
   * Pause training program
   */
  pauseProgram: protectedProcedure
    .input(
      z.object({
        progressId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .update(trainingProgress)
        .set({
          status: "paused",
        })
        .where(eq(trainingProgress.id, input.progressId));

      return result;
    }),

  /**
   * Resume training program
   */
  resumeProgram: protectedProcedure
    .input(
      z.object({
        progressId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .update(trainingProgress)
        .set({
          status: "in_progress",
        })
        .where(eq(trainingProgress.id, input.progressId));

      return result;
    }),

  /**
   * Get recommended programs for pet based on age and species
   */
  getRecommended: publicProcedure
    .input(
      z.object({
        species: z.enum(["cat", "dog"]),
        ageMonths: z.number(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const items = await db.select().from(trainingPrograms).limit(20);

      // Filter by age range and species
      return items.filter((program) => {
        // For now, return all programs - can add age-based filtering later
        return true;
      });
    }),
});
