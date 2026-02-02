/**
 * Mistral AI-Powered Diagnosis Router
 * Provides AI-assisted veterinary diagnosis and analysis procedures
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  generateVeterinaryDiagnosis,
  analyzeCaseNotes,
  generateEducationalContent,
  analyzeMedicationInteractions,
} from "../_core/mistral";

export const diagnosisRouter = router({
  /**
   * Generate AI-powered diagnosis based on symptoms
   * Requires authentication to track case history
   */
  generateDiagnosis: protectedProcedure
    .input(
      z.object({
        species: z.enum(["cat", "dog"]),
        symptoms: z.array(z.string()).min(1),
        age: z.number().optional(),
        weight: z.number().optional(),
        medicalHistory: z.string().optional(),
        allergies: z.string().optional(),
        currentMedications: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const diagnosis = await generateVeterinaryDiagnosis({
          species: input.species,
          symptoms: input.symptoms,
          age: input.age,
          weight: input.weight,
          medicalHistory: input.medicalHistory,
          allergies: input.allergies,
          currentMedications: input.currentMedications,
        });

        return {
          success: true,
          data: diagnosis,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("[Diagnosis] Generation failed:", error);
        throw new Error(
          `Failed to generate diagnosis: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Analyze case notes and extract structured information
   * Useful for processing veterinary consultation notes
   */
  analyzeCaseNotes: protectedProcedure
    .input(
      z.object({
        caseNotes: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const analysis = await analyzeCaseNotes(input.caseNotes);

        return {
          success: true,
          data: analysis,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("[Diagnosis] Case analysis failed:", error);
        throw new Error(
          `Failed to analyze case notes: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Generate educational content about a specific condition
   * Public access for educational purposes
   */
  getEducationalContent: publicProcedure
    .input(
      z.object({
        condition: z.string().min(2),
        species: z.enum(["cat", "dog"]),
      })
    )
    .query(async ({ input }) => {
      try {
        const content = await generateEducationalContent(
          input.condition,
          input.species
        );

        return {
          success: true,
          data: content,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("[Diagnosis] Educational content generation failed:", error);
        throw new Error(
          `Failed to generate educational content: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Analyze medication interactions
   * Protected procedure for authenticated users
   */
  analyzeMedicationInteractions: protectedProcedure
    .input(
      z.object({
        medications: z.array(z.string()).min(2),
      })
    )
    .query(async ({ input }) => {
      try {
        const analysis = await analyzeMedicationInteractions(
          input.medications
        );

        return {
          success: true,
          data: analysis,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("[Diagnosis] Medication interaction analysis failed:", error);
        throw new Error(
          `Failed to analyze medication interactions: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Quick symptom assessment for emergency triage
   * Public access for urgent situations
   */
  quickTriageAssessment: publicProcedure
    .input(
      z.object({
        species: z.enum(["cat", "dog"]),
        symptoms: z.array(z.string()).min(1),
        severity: z.enum(["mild", "moderate", "severe", "critical"]),
      })
    )
    .query(async ({ input }) => {
      try {
        // Use the full diagnosis engine but with triage focus
        const diagnosis = await generateVeterinaryDiagnosis({
          species: input.species,
          symptoms: input.symptoms,
        });

        // Ensure urgency matches severity input
        const urgencyMap: Record<string, typeof diagnosis.urgency> = {
          mild: "routine",
          moderate: "routine",
          severe: "urgent",
          critical: "critical",
        };

        return {
          success: true,
          data: {
            ...diagnosis,
            urgency: urgencyMap[input.severity] || diagnosis.urgency,
            isEmergency: input.severity === "critical" || input.severity === "severe",
          },
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("[Diagnosis] Triage assessment failed:", error);
        throw new Error(
          `Failed to perform triage assessment: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),
});
