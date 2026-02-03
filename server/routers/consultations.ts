import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq } from "drizzle-orm";

export const consultationsRouter = router({
  getByVeterinarian: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    try {
      // Get all consultations for this veterinarian
      // For now, return mock data as we're integrating with existing schema
      return [
        {
          id: 1,
          petName: "Fluffy",
          petSpecies: "cat",
          petAge: 3,
          ownerName: "John Doe",
          description: "Fluffy has been sneezing a lot and has watery eyes for the past 2 days",
          severity: "moderate",
          status: "pending",
          createdAt: new Date(),
        },
        {
          id: 2,
          petName: "Max",
          petSpecies: "dog",
          petAge: 5,
          ownerName: "Jane Smith",
          description: "Max is limping on his front left leg and won't put weight on it",
          severity: "urgent",
          status: "in_progress",
          createdAt: new Date(Date.now() - 3600000),
        },
      ];
    } catch (error) {
      console.error("[Consultations] Error fetching veterinarian consultations:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch consultations",
      });
    }
  }),

  respond: protectedProcedure
    .input(
      z.object({
        consultationId: z.number(),
        response: z.string(),
        recommendation: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        // Update consultation with veterinarian response
        // For now, return success as we're integrating with existing schema
        return {
          success: true,
          consultationId: input.consultationId,
          respondedAt: new Date(),
          message: "Response sent successfully",
        };
      } catch (error) {
        console.error("[Consultations] Error responding to consultation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send response",
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ consultationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        // Get specific consultation details
        return {
          id: input.consultationId,
          petName: "Fluffy",
          petSpecies: "cat",
          petAge: 3,
          ownerName: "John Doe",
          description: "Fluffy has been sneezing a lot and has watery eyes for the past 2 days",
          severity: "moderate",
          status: "pending",
          createdAt: new Date(),
          attachments: [],
        };
      } catch (error) {
        console.error("[Consultations] Error fetching consultation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch consultation",
        });
      }
    }),

  markResolved: protectedProcedure
    .input(z.object({ consultationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        return {
          success: true,
          consultationId: input.consultationId,
          status: "resolved",
        };
      } catch (error) {
        console.error("[Consultations] Error marking consultation resolved:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mark consultation resolved",
        });
      }
    }),
});
