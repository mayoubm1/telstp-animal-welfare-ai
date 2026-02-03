import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
// Import from schema when available - for now using basic queries
import { invokeLLM } from "../_core/llm";
import { storagePut, storageGet } from "../storage";
import { eq } from "drizzle-orm";

export const imageAnalysisRouter = router({
  // Upload image and analyze for pet conditions
  uploadAndAnalyze: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        imageBase64: z.string(),
        imageType: z.enum(["skin", "eye", "dental", "ear", "general"]),
        description: z.string().optional(),
        conditionArea: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        // Validate pet ownership - for now skip as we're using simple schema
        // In production, verify pet belongs to user

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(input.imageBase64, "base64");

        // Upload to S3
        const fileKey = `pets/${ctx.user.id}/images/${input.petId}-${Date.now()}.jpg`;
        const { url: imageUrl } = await storagePut(fileKey, imageBuffer, "image/jpeg");

        // Analyze image with Mistral AI
        const analysisPrompt = `You are a veterinary diagnostic AI assistant. Analyze this pet image and provide:
1. Visible condition assessment (${input.imageType})
2. Potential conditions (list top 3-5 possibilities with confidence scores 0-100)
3. Severity level (mild/moderate/severe/critical)
4. Recommended action (home care/vet visit soon/emergency vet/specialist referral)
5. Key observations and findings
6. Safety warnings if applicable

Image type: ${input.imageType}
${input.description ? `Owner description: ${input.description}` : ""}
${input.conditionArea ? `Affected area: ${input.conditionArea}` : ""}

Provide response in JSON format with fields: conditions, severity, recommendation, observations, warnings`;

        const analysisResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a veterinary diagnostic AI. Analyze pet images and provide structured diagnostic information. Always respond with valid JSON.",
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                    detail: "high",
                  },
                },
                {
                  type: "text",
                  text: analysisPrompt,
                },
              ],
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "pet_image_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  conditions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        confidence: { type: "number", minimum: 0, maximum: 100 },
                        description: { type: "string" },
                      },
                      required: ["name", "confidence"],
                    },
                  },
                  severity: { type: "string", enum: ["mild", "moderate", "severe", "critical"] },
                  recommendation: { type: "string" },
                  observations: { type: "string" },
                  warnings: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["conditions", "severity", "recommendation", "observations", "warnings"],
                additionalProperties: false,
              },
            },
          },
        });

        const analysisContent = analysisResponse.choices[0]?.message.content;
        if (!analysisContent || typeof analysisContent !== 'string') {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to analyze image",
          });
        }

        const analysis = JSON.parse(analysisContent);

        return {
          imageUrl,
          fileKey,
          analysis,
          uploadedAt: new Date(),
          imageType: input.imageType,
        };
      } catch (error) {
        console.error("[Image Analysis] Failed to upload and analyze:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload and analyze image",
        });
      }
    }),

  // Get image analysis history for a pet
  getHistory: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        // Get image history - for now return empty as schema integration pending
        const attachments: any[] = [];

        return attachments;
      } catch (error) {
        console.error("[Image Analysis] Failed to get history:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch image history",
        });
      }
    }),

  // Compare images over time
  compareImages: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        imageUrl1: z.string(),
        imageUrl2: z.string(),
        imageType: z.enum(["skin", "eye", "dental", "ear", "general"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const comparisonPrompt = `Compare these two pet images taken at different times and provide:
1. Changes observed between the two images
2. Improvement or deterioration assessment
3. Trend analysis (getting better/worse/stable)
4. Updated recommendations based on progression
5. Whether veterinary follow-up is needed

Image type: ${input.imageType}

Provide response in JSON format with fields: changes, trend, assessment, recommendations, followUpNeeded`;

        const comparisonResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a veterinary diagnostic AI. Compare pet images over time and assess progression. Always respond with valid JSON.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "First image (earlier):",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: input.imageUrl1,
                    detail: "high",
                  },
                },
                {
                  type: "text",
                  text: "Second image (recent):",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: input.imageUrl2,
                    detail: "high",
                  },
                },
                {
                  type: "text",
                  text: comparisonPrompt,
                },
              ],
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "image_comparison",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  changes: { type: "string" },
                  trend: { type: "string", enum: ["improving", "worsening", "stable"] },
                  assessment: { type: "string" },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                  },
                  followUpNeeded: { type: "boolean" },
                },
                required: ["changes", "trend", "assessment", "recommendations", "followUpNeeded"],
                additionalProperties: false,
              },
            },
          },
        });

        const comparisonContent = comparisonResponse.choices[0]?.message.content;
        if (!comparisonContent || typeof comparisonContent !== 'string') {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to compare images",
          });
        }

        let comparison;
        try {
          comparison = JSON.parse(comparisonContent);
        } catch {
          comparison = { changes: comparisonContent, trend: 'stable', assessment: 'Unable to parse response', recommendations: [], followUpNeeded: false };
        }

        return {
          comparison,
          comparedAt: new Date(),
        };
      } catch (error) {
        console.error("[Image Analysis] Failed to compare images:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to compare images",
        });
      }
    }),

  // Assess image quality and provide guidance
  assessQuality: protectedProcedure
    .input(
      z.object({
        imageBase64: z.string(),
        imageType: z.enum(["skin", "eye", "dental", "ear", "general"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const qualityPrompt = `Assess the quality of this pet image for diagnostic purposes. Evaluate:
1. Image clarity and focus
2. Lighting adequacy
3. Angle and framing appropriateness for ${input.imageType} diagnosis
4. Presence of distracting elements
5. Overall suitability for AI analysis
6. Specific improvement suggestions if needed

Provide response in JSON format with fields: qualityScore (0-100), isAcceptable (boolean), issues (array), suggestions (array)`;

        const imageBuffer = Buffer.from(input.imageBase64, "base64");
        const tempUrl = `data:image/jpeg;base64,${input.imageBase64}`;

        const qualityResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a veterinary image quality assessor. Evaluate pet images for diagnostic suitability. Always respond with valid JSON.",
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: tempUrl,
                    detail: "low",
                  },
                },
                {
                  type: "text",
                  text: qualityPrompt,
                },
              ],
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "image_quality_assessment",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  qualityScore: { type: "number", minimum: 0, maximum: 100 },
                  isAcceptable: { type: "boolean" },
                  issues: {
                    type: "array",
                    items: { type: "string" },
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["qualityScore", "isAcceptable", "issues", "suggestions"],
                additionalProperties: false,
              },
            },
          },
        });

        const qualityContent = qualityResponse.choices[0]?.message.content;
        if (!qualityContent || typeof qualityContent !== 'string') {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to assess image quality",
          });
        }

        const quality = JSON.parse(qualityContent);

        return {
          quality,
          assessedAt: new Date(),
        };
      } catch (error) {
        console.error("[Image Analysis] Failed to assess quality:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to assess image quality",
        });
      }
    }),
});
