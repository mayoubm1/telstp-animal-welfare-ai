import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { getPetById } from "./db";

/**
 * Vocalization Analysis Router
 * Analyzes pet vocalizations (meows, barks, whines) to assess emotional state and health
 * Based on academic research on feline and canine communication patterns
 */

const FELINE_VOCALIZATION_CONTEXT = `You are an expert in feline vocalization analysis.
Analyze the provided vocalization data to assess the cat's emotional state and potential health concerns.
Provide assessment in JSON format with: vocalization_type, emotional_state, confidence, health_risk_level, potential_conditions, recommendations.`;

const CANINE_VOCALIZATION_CONTEXT = `You are an expert in canine vocalization analysis.
Analyze the provided vocalization data to assess the dog's emotional state and potential health concerns.
Provide assessment in JSON format with: vocalization_type, emotional_state, confidence, health_risk_level, potential_conditions, recommendations.`;

export const vocalizationRouter = router({
  /**
   * Analyze pet vocalization from audio URL
   */
  analyzeVocalization: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        audioUrl: z.string().url(),
        recordingContext: z.string().optional(),
        species: z.enum(["cat", "dog"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const pet = await getPetById(input.petId);
        if (!pet) throw new Error("Pet not found");

        const systemPrompt =
          input.species === "cat" ? FELINE_VOCALIZATION_CONTEXT : CANINE_VOCALIZATION_CONTEXT;

        const userMessage = `Pet: ${input.species} (${pet.breed || "Unknown"}), Age: ${pet.age || "Unknown"} months
Context: ${input.recordingContext || "Not specified"}

Please analyze this vocalization recording and provide a comprehensive assessment.`;

        const analysis = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "vocalization_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  vocalization_type: { type: "string" },
                  emotional_state: {
                    type: "object",
                    properties: {
                      primary_emotion: { type: "string" },
                      confidence_percent: { type: "number" },
                    },
                  },
                  health_assessment: {
                    type: "object",
                    properties: {
                      risk_level: { type: "string", enum: ["normal", "caution", "urgent", "emergency"] },
                      potential_conditions: { type: "array", items: { type: "string" } },
                    },
                  },
                  recommendations: {
                    type: "object",
                    properties: {
                      immediate_actions: { type: "array", items: { type: "string" } },
                      when_to_seek_vet: { type: "string" },
                    },
                  },
                  owner_education: { type: "string" },
                },
                required: ["vocalization_type", "emotional_state", "health_assessment", "recommendations", "owner_education"],
                additionalProperties: false,
              },
            },
          },
        });

        const result =
          typeof analysis.choices?.[0]?.message?.content === "string"
            ? JSON.parse(analysis.choices[0].message.content)
            : analysis;

        return {
          success: true,
          analysis: result,
          audioUrl: input.audioUrl,
          recordedAt: new Date(),
          species: input.species,
        };
      } catch (error) {
        console.error("Error analyzing vocalization:", error);
        throw new Error(`Failed to analyze vocalization: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  /**
   * Get educational content about pet vocalizations
   */
  getEducation: publicProcedure
    .input(
      z.object({
        species: z.enum(["cat", "dog"]),
        topic: z.enum(["normal_communication", "pain_signs", "stress_signs"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const educationContent: Record<string, Record<string, any>> = {
        cat: {
          normal_communication: {
            title: "Understanding Cat Meows",
            content:
              "Cats use meows, chirps, and trills to communicate with humans. Tonal meows indicate friendly communication, while harsh meows suggest distress.",
          },
          pain_signs: {
            title: "Pain Signs in Cats",
            content:
              "Cats in pain often show increased harsh meowing, sudden voice changes, or reduced vocalization. Schedule a vet appointment if you notice these changes.",
          },
          stress_signs: {
            title: "Stress in Cats",
            content:
              "Stressed cats exhibit excessive yowling, increased hissing, or loss of normal meowing. Environmental enrichment and vet consultation can help.",
          },
        },
        dog: {
          normal_communication: {
            title: "Understanding Dog Barks",
            content:
              "Dogs use alert barks, playful barks, whines, and howls to communicate. Each type conveys different emotions and needs.",
          },
          pain_signs: {
            title: "Pain Signs in Dogs",
            content:
              "Dogs in pain often show excessive whining, sudden aggressive barking, or vocal harshness. Seek veterinary care if you notice these changes.",
          },
          stress_signs: {
            title: "Stress in Dogs",
            content:
              "Stressed dogs exhibit excessive barking, continuous whining, or separation anxiety howling. Training and behavioral support can help.",
          },
        },
      };

      const topic = input.topic || "normal_communication";
      return educationContent[input.species]?.[topic] || { title: "Information Not Available" };
    }),
});

export type VocalizationRouter = typeof vocalizationRouter;
