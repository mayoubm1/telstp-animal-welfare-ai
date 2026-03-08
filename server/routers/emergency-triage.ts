import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { emergencyTriageCases, caseHistory, pets, vetClinics, veterinarians, InsertEmergencyTriageCase } from "../../drizzle/schema";
import { eq, desc, and, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";

/**
 * Emergency Triage Router
 * Handles emergency case assessment, alerts, and routing to nearest emergency clinics
 */
export const emergencyTriageRouter = router({
  /**
   * Assess case for emergency triage
   * Uses AI to evaluate symptoms and determine urgency level
   */
  assessEmergency: protectedProcedure
    .input(
      z.object({
        caseHistoryId: z.number().int().positive(),
        symptoms: z.string().min(10, "Symptoms description too short"),
        severity: z.enum(["mild", "moderate", "severe", "critical"]),
        petSpecies: z.enum(["cat", "dog"]),
        petAge: z.number().int().optional(),
        additionalInfo: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        // Get case history and pet details
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const caseData = await db
          .select()
          .from(caseHistory)
          .where(eq(caseHistory.id, input.caseHistoryId))
          .limit(1);

        if (!caseData.length) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Case not found" });
        }

        const petData = await db
          .select()
          .from(pets)
          .where(eq(pets.id, caseData[0].petId))
          .limit(1);

        // Use AI to assess emergency level
        const aiAssessment = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an emergency veterinary triage AI. Assess the urgency of a pet's condition based on symptoms. 
              
              Respond with JSON containing:
              - triageLevel: "urgent" | "critical" | "life_threatening"
              - estimatedSeverity: number 1-10
              - recommendedAction: "immediate_vet_visit" | "emergency_clinic" | "call_vet_first" | "monitor_closely"
              - reason: brief explanation
              - warningFlags: array of concerning symptoms`,
            },
            {
              role: "user",
              content: `Pet: ${input.petSpecies}, Age: ${input.petAge || "unknown"} months
              
Symptoms: ${input.symptoms}
Current Severity Level: ${input.severity}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ""}

Please assess the emergency level of this case.`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "emergency_assessment",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  triageLevel: {
                    type: "string",
                    enum: ["urgent", "critical", "life_threatening"],
                  },
                  estimatedSeverity: { type: "number", minimum: 1, maximum: 10 },
                  recommendedAction: {
                    type: "string",
                    enum: ["immediate_vet_visit", "emergency_clinic", "call_vet_first", "monitor_closely"],
                  },
                  reason: { type: "string" },
                  warningFlags: { type: "array", items: { type: "string" } },
                },
                required: ["triageLevel", "estimatedSeverity", "recommendedAction", "reason", "warningFlags"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = aiAssessment.choices[0].message.content;
        const assessment = JSON.parse(typeof content === "string" ? content : "{}");

        // Find nearest emergency clinic
        const vetData = petData[0];
        let nearestClinic = null;
        let nearestDistance: number | null = null;

        // Find nearest emergency clinic by filtering emergency services
        const clinics = await db.select().from(vetClinics);
        const emergencyClinics = clinics.filter((c: any) => c.isEmergencyService);

        if (emergencyClinics.length > 0) {
          // In production, use actual geolocation API
          // For now, just pick the first emergency clinic
          nearestClinic = emergencyClinics[0];
          nearestDistance = 5; // placeholder distance in km
        }

        // Create emergency triage case record
        const insertData: InsertEmergencyTriageCase = {
          caseHistoryId: input.caseHistoryId,
          petId: caseData[0].petId,
          userId: ctx.user.id,
          triageLevel: assessment.triageLevel as "urgent" | "critical" | "life_threatening",
          reason: assessment.reason,
          symptoms: input.symptoms,
          estimatedSeverity: assessment.estimatedSeverity,
          recommendedAction: assessment.recommendedAction as "immediate_vet_visit" | "emergency_clinic" | "call_vet_first" | "monitor_closely",
          nearestClinicId: nearestClinic?.id || null,
          nearestClinicDistance: nearestDistance ? String(nearestDistance) : null,
          status: "pending",
          notes: `Warning flags: ${assessment.warningFlags.join(", ")}`,
        };
        const triageResult = await db.insert(emergencyTriageCases).values(insertData);

        // Send alert to veterinarians if critical
        if (assessment.triageLevel === "critical" || assessment.triageLevel === "life_threatening") {
          await alertVeterinarians(
            input.caseHistoryId,
            caseData[0].petId,
            assessment.triageLevel,
            assessment.reason,
            ctx.user.id
          );
        }

        // Notify owner
        await notifyOwner({
          title: `Emergency Alert: ${assessment.triageLevel.toUpperCase()}`,
          content: `Your pet requires immediate attention. ${assessment.reason}. Recommended action: ${assessment.recommendedAction}`,
        });

        return {
          success: true,
          triageCase: triageResult,
          assessment,
          nearestClinic,
        };
      } catch (error) {
        console.error("Emergency triage assessment error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to assess emergency case",
        });
      }
    }),

  /**
   * Get emergency cases for a veterinarian
   */
  getEmergencyCases: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user || ctx.user.role !== "veterinarian") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only veterinarians can view emergency cases" });
    }

    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const cases = await db
        .select()
        .from(emergencyTriageCases)
        .where(and(eq(emergencyTriageCases.status, "pending"), lte(emergencyTriageCases.triageLevel, "critical")))
        .orderBy(desc(emergencyTriageCases.createdAt))
        .limit(50);

      return cases;
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch emergency cases" });
    }
  }),

  /**
   * Acknowledge emergency case
   */
  acknowledgeEmergency: protectedProcedure
    .input(z.object({ caseId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.role !== "veterinarian") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const updated = await db
          .update(emergencyTriageCases)
          .set({
            status: "acknowledged",
            assignedVeterinarianId: ctx.user.id,
            updatedAt: new Date(),
          })
          .where(eq(emergencyTriageCases.id, input.caseId));

        return { success: true, updated };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to acknowledge case" });
      }
    }),

  /**
   * Update emergency case status
   */
  updateEmergencyStatus: protectedProcedure
    .input(
      z.object({
        caseId: z.number().int().positive(),
        status: z.enum(["pending", "acknowledged", "in_progress", "resolved", "escalated"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.role !== "veterinarian") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const updated = await db
          .update(emergencyTriageCases)
          .set({
            status: input.status,
            notes: input.notes,
            updatedAt: new Date(),
          })
          .where(eq(emergencyTriageCases.id, input.caseId));

        return { success: true, updated };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update case status" });
      }
    }),

  /**
   * Get emergency case details
   */
  getEmergencyCase: protectedProcedure
    .input(z.object({ caseId: z.number().int().positive() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const triageCase = await db
          .select()
          .from(emergencyTriageCases)
          .where(eq(emergencyTriageCases.id, input.caseId))
          .limit(1);

        if (!triageCase.length) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Emergency case not found" });
        }

        const caseData = triageCase[0];

        // Get related case history
        const caseHist = await db
          .select()
          .from(caseHistory)
          .where(eq(caseHistory.id, caseData.caseHistoryId))
          .limit(1);

        // Get pet details
        const petData = await db.select().from(pets).where(eq(pets.id, caseData.petId)).limit(1);

        // Get nearest clinic details
        let clinic: any = null;
        if (caseData.nearestClinicId) {
          const clinicData = await db
            .select()
            .from(vetClinics)
            .where(eq(vetClinics.id, caseData.nearestClinicId))
            .limit(1);
          clinic = clinicData[0];
        }

        return {
          triageCase: caseData,
          caseHistory: caseHist[0],
          pet: petData[0],
          nearestClinic: clinic,
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch emergency case" });
      }
    }),
});

/**
 * Helper function to alert veterinarians about critical cases
 */
async function alertVeterinarians(
  caseHistoryId: number,
  petId: number,
  triageLevel: string,
  reason: string,
  userId: number
) {
  try {
    const db = await getDb();
    if (!db) return;

    // Get all verified emergency veterinarians
    const emergencyVets = await db
      .select()
      .from(veterinarians)
      .where(eq(veterinarians.verified, true))
      .limit(20);

    // Send notifications to each vet
    for (const vet of emergencyVets) {
      // In production, use proper notification service (Firebase, OneSignal, etc.)
      console.log(`Alert sent to vet ${vet.id}: ${triageLevel} case`);
    }

    // Update triage case to mark alert as sent
    await db
      .update(emergencyTriageCases)
      .set({
        alertSentToVets: true,
        alertSentAt: new Date(),
      })
      .where(eq(emergencyTriageCases.caseHistoryId, caseHistoryId));
  } catch (error) {
    console.error("Failed to alert veterinarians:", error);
  }
}
