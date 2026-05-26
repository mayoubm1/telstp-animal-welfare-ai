/**
 * Mistral AI-Powered Diagnosis Router
 * Provides AI-assisted veterinary diagnosis and analysis procedures
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { transcribeAudio } from "../_core/voiceTranscription";
import { invokeLLM } from "../_core/llm";
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
   * Transcribe audio recording of pet sounds
   * Converts audio to text for analysis
   */
  transcribeAudio: protectedProcedure
    .input(
      z.object({
        audioUrl: z.string().url(),
        language: z.string().optional().default("en"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
        });

        // Handle both success and error responses
        if ('text' in result) {
          return {
            success: true,
            data: result.text,
            language: result.language || 'en',
            timestamp: new Date(),
          };
        } else {
          throw new Error('Audio transcription failed');
        }
      } catch (error) {
        console.error("[Diagnosis] Audio transcription failed:", error);
        throw new Error(
          `Failed to transcribe audio: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Analyze multimedia inputs (photo, video, audio) for diagnosis
   * Combines visual, audio, and text analysis
   */
  analyzeMultimedia: protectedProcedure
    .input(
      z.object({
        petSpecies: z.enum(["cat", "dog"]),
        symptoms: z.string().optional(),
        audioTranscript: z.string().optional(),
        mediaType: z.enum(["photo", "video"]).optional(),
        mediaUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Build comprehensive analysis prompt
        let analysisPrompt = `You are an expert veterinary AI assistant analyzing a case for a ${input.petSpecies}.\n\n`;

        if (input.symptoms) {
          analysisPrompt += `Owner-reported symptoms: ${input.symptoms}\n`;
        }

        if (input.audioTranscript) {
          analysisPrompt += `Audio analysis (pet sounds): ${input.audioTranscript}\n`;
        }

        if (input.mediaType && input.mediaUrl) {
          analysisPrompt += `Visual media (${input.mediaType}): Analyze the provided ${input.mediaType} for visible signs of illness or injury.\n`;
        }

        analysisPrompt += `\nProvide:\n1. Detailed analysis of all inputs\n2. Likely diagnosis (with confidence level)\n3. Recommended actions (list 3-5 specific steps)\n4. When to seek emergency care\n\nFormat as JSON with keys: analysis, diagnosis, confidence, recommendations, emergencyWarnings`;

        // Call LLM with multimedia context
        const messages: any[] = [
          {
            role: "system",
            content: "You are a veterinary diagnostic AI. Analyze all provided information and give clear, actionable recommendations.",
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ];

        // Add image if provided
        if (input.mediaUrl && input.mediaType === "photo") {
          messages[1] = {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              {
                type: "image_url",
                image_url: {
                  url: input.mediaUrl,
                  detail: "high",
                },
              },
            ],
          };
        }

        const response = await invokeLLM({
          messages: messages as any,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "veterinary_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  analysis: { type: "string" },
                  diagnosis: { type: "string" },
                  confidence: { type: "string" },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                  },
                  emergencyWarnings: { type: "string" },
                },
                required: ["analysis", "diagnosis", "confidence", "recommendations", "emergencyWarnings"],
              },
            },
          },
        });

        const content = response.choices[0].message.content;
        const analysisResult = typeof content === 'string' ? JSON.parse(content) : content;

        return {
          success: true,
          data: {
            analysis: analysisResult?.analysis || 'Analysis pending',
            diagnosis: analysisResult?.diagnosis || 'Diagnosis pending',
            confidence: analysisResult?.confidence || 'Unknown',
            recommendations: analysisResult?.recommendations || [],
            emergencyWarnings: analysisResult?.emergencyWarnings || 'None',
          },
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("[Diagnosis] Multimedia analysis failed:", error);
        throw new Error(
          `Failed to analyze multimedia: ${error instanceof Error ? error.message : "Unknown error"}`
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
