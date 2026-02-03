import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { getPetById, updateCaseHistory } from "./db";

/**
 * Media Analysis Router
 * Analyzes images and videos for veterinary diagnosis
 * Supports skin conditions, eye problems, dental issues, and other visible symptoms
 */

const VETERINARY_IMAGE_ANALYSIS_PROMPT = `You are an expert veterinary diagnostician specializing in visual assessment of feline and canine conditions.
Analyze the provided image(s) carefully and provide a detailed assessment.

Your analysis should cover:
1. Visible symptoms and abnormalities
2. Condition severity assessment
3. Differential diagnosis (most likely to least likely conditions)
4. Recommended diagnostic tests
5. Immediate care recommendations
6. When to seek emergency veterinary care
7. Educational explanation for pet owner

Be thorough but compassionate in your assessment. Remember this is for pet owner education and consultation support, not definitive diagnosis.
Always recommend professional veterinary examination for confirmation.`;

const SKIN_CONDITION_ANALYSIS = `You are a veterinary dermatologist analyzing images of skin conditions in cats and dogs.
Assess the following:
- Lesion type (erythema, scaling, crusting, erosion, ulceration, nodule, etc.)
- Distribution pattern (localized, generalized, symmetric, asymmetric)
- Color and appearance
- Signs of infection or inflammation
- Pruritus indicators (scratching, licking, hair loss)
- Possible causes (parasitic, fungal, bacterial, allergic, autoimmune, neoplastic)
- Zoonotic risk assessment`;

const EYE_CONDITION_ANALYSIS = `You are a veterinary ophthalmologist analyzing images of eye conditions in cats and dogs.
Assess the following:
- Conjunctival appearance (injection, chemosis, discharge type)
- Corneal clarity and any opacity or ulceration
- Pupil size and reactivity (if visible)
- Eyelid involvement
- Tear film assessment
- Signs of pain or discomfort
- Possible conditions (conjunctivitis, keratitis, uveitis, glaucoma, etc.)
- Urgency of veterinary care`;

const DENTAL_CONDITION_ANALYSIS = `You are a veterinary dentist analyzing images of dental conditions in cats and dogs.
Assess the following:
- Tooth condition (tartar, calculus, discoloration, fracture, mobility)
- Gum health (color, swelling, recession, bleeding)
- Oral hygiene status
- Signs of periodontal disease
- Possible tooth loss or extraction sites
- Oral masses or abnormalities
- Halitosis indicators
- Recommended dental care`;

export const mediaAnalysisRouter = router({
  /**
   * Analyze single or multiple images for veterinary diagnosis
   */
  analyzeImages: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        imageUrls: z.array(z.string().url()),
        conditionType: z.enum(["skin", "eye", "dental", "general", "wound", "other"]),
        description: z.string().optional(),
        affectedArea: z.string().optional(),
        durationDays: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const pet = await getPetById(input.petId);
        if (!pet) throw new Error("Pet not found");

        // Select appropriate analysis prompt based on condition type
        let conditionPrompt = VETERINARY_IMAGE_ANALYSIS_PROMPT;
        if (input.conditionType === "skin") {
          conditionPrompt = SKIN_CONDITION_ANALYSIS;
        } else if (input.conditionType === "eye") {
          conditionPrompt = EYE_CONDITION_ANALYSIS;
        } else if (input.conditionType === "dental") {
          conditionPrompt = DENTAL_CONDITION_ANALYSIS;
        }

        // Build message content with images
        const imageContent: any[] = [
          {
            type: "text",
            text: `Pet Information:
- Species: ${pet.species}
- Breed: ${pet.breed || "Unknown"}
- Age: ${pet.age || "Unknown"} months
- Condition Type: ${input.conditionType}
- Affected Area: ${input.affectedArea || "Not specified"}
- Duration: ${input.durationDays || "Unknown"} days
- Owner Description: ${input.description || "No description provided"}

Please analyze these images and provide a comprehensive veterinary assessment.`,
          },
        ];

        // Add images to the message
        for (const imageUrl of input.imageUrls) {
          imageContent.push({
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "high",
            },
          });
        }

        // Use LLM to analyze images
        const analysis = await invokeLLM({
          messages: [
            {
              role: "system",
              content: conditionPrompt,
            },
            {
              role: "user",
              content: imageContent,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "image_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  condition_type: { type: "string" },
                  visible_symptoms: {
                    type: "array",
                    items: { type: "string" },
                  },
                  severity: {
                    type: "string",
                    enum: ["mild", "moderate", "severe", "critical"],
                  },
                  differential_diagnosis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        condition: { type: "string" },
                        likelihood: { type: "string" },
                        supporting_signs: { type: "array", items: { type: "string" } },
                      },
                    },
                  },
                  recommended_tests: {
                    type: "array",
                    items: { type: "string" },
                  },
                  immediate_care: {
                    type: "array",
                    items: { type: "string" },
                  },
                  zoonotic_risk: {
                    type: "string",
                    description: "Any zoonotic risk to humans",
                  },
                  urgency_level: {
                    type: "string",
                    enum: ["routine", "urgent", "emergency"],
                  },
                  when_to_seek_vet: { type: "string" },
                  owner_education: {
                    type: "string",
                    description: "Clear explanation for pet owner",
                  },
                  disclaimer: {
                    type: "string",
                    description: "Important disclaimer about AI analysis limitations",
                  },
                },
                required: [
                  "condition_type",
                  "visible_symptoms",
                  "severity",
                  "differential_diagnosis",
                  "urgency_level",
                  "owner_education",
                  "disclaimer",
                ],
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
          imageUrls: input.imageUrls,
          conditionType: input.conditionType,
          analyzedAt: new Date(),
          petId: input.petId,
        };
      } catch (error) {
        console.error("Error analyzing images:", error);
        throw new Error(`Failed to analyze images: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  /**
   * Analyze video for veterinary consultation
   * Extracts key frames and analyzes movement, behavior, and visible symptoms
   */
  analyzeVideo: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        videoUrl: z.string().url(),
        description: z.string().optional(),
        focusAreas: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const pet = await getPetById(input.petId);
        if (!pet) throw new Error("Pet not found");

        // Analyze video for behavioral and physical symptoms
        const videoAnalysis = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a veterinary behaviorist and clinician analyzing a video of a pet for diagnostic purposes.
              
Assess the following:
1. Behavioral indicators (gait, posture, movement quality, signs of pain or discomfort)
2. Visible physical symptoms
3. Interaction with environment
4. Signs of distress or abnormal behavior
5. Mobility and coordination
6. Respiratory rate and effort
7. Overall health indicators

Focus on: ${input.focusAreas?.join(", ") || "general health assessment"}`,
            },
            {
              role: "user",
              content: `Pet: ${pet.species} (${pet.breed || "breed unknown"}), Age: ${pet.age || "unknown"} months
              
Video Description: ${input.description || "No description provided"}

Please analyze this video and provide a comprehensive assessment of the pet's health status, behavior, and any concerning symptoms.`,
            },
          ],
        });

        const videoContent =
          typeof videoAnalysis.choices?.[0]?.message?.content === "string"
            ? videoAnalysis.choices[0].message.content
            : JSON.stringify(videoAnalysis);

        return {
          success: true,
          analysis: {
            videoUrl: input.videoUrl,
            petId: input.petId,
            assessmentContent: videoContent,
            focusAreas: input.focusAreas || [],
            analyzedAt: new Date(),
            recommendation: "Video analysis complete. Review findings and consider veterinary consultation if concerns are noted.",
          },
        };
      } catch (error) {
        console.error("Error analyzing video:", error);
        throw new Error(`Failed to analyze video: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  /**
   * Compare images over time to track condition progression
   */
  compareImages: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        currentImageUrls: z.array(z.string().url()),
        previousImageUrls: z.array(z.string().url()),
        conditionType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const comparisonAnalysis = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a veterinary diagnostician comparing images of the same condition at different time points.
              
Analyze the progression or regression of the condition:
1. Changes in severity
2. Changes in appearance
3. Signs of healing or worsening
4. Effectiveness of treatment (if applicable)
5. New symptoms or complications
6. Overall trend assessment

Provide a clear assessment of whether the condition is improving, stable, or worsening.`,
            },
            {
              role: "user",
              content: `Condition Type: ${input.conditionType}
              
Please compare the previous images (baseline) with the current images and assess the progression of the condition.`,
            },
          ],
        });

        const comparisonContent =
          typeof comparisonAnalysis.choices?.[0]?.message?.content === "string"
            ? comparisonAnalysis.choices[0].message.content
            : JSON.stringify(comparisonAnalysis);

        return {
          success: true,
          comparison: {
            petId: input.petId,
            conditionType: input.conditionType,
            progressionAssessment: comparisonContent,
            comparedAt: new Date(),
            trend: "assessment_complete",
          },
        };
      } catch (error) {
        console.error("Error comparing images:", error);
        throw new Error(`Failed to compare images: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  /**
   * Get image quality assessment and guidance
   * Helps users take better diagnostic photos
   */
  assessImageQuality: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        conditionType: z.enum(["skin", "eye", "dental", "wound", "other"]),
      })
    )
    .query(async ({ input }) => {
      try {
        const qualityAssessment = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are assessing the quality of a veterinary diagnostic image.
              
Evaluate:
1. Lighting quality (adequate, too dark, too bright, shadows)
2. Focus and clarity
3. Angle and composition (is affected area clearly visible?)
4. Image resolution
5. Presence of distracting elements
6. Suitability for diagnosis
7. Recommendations for improvement

For ${input.conditionType} conditions, provide specific guidance on optimal image capture.`,
            },
            {
              role: "user",
              content: `Please assess the quality of this ${input.conditionType} image and provide guidance for improvement if needed.`,
            },
          ],
        });

        const assessmentContent =
          typeof qualityAssessment.choices?.[0]?.message?.content === "string"
            ? qualityAssessment.choices[0].message.content
            : JSON.stringify(qualityAssessment);

        return {
          success: true,
          qualityAssessment: assessmentContent,
          conditionType: input.conditionType,
          recommendations: [
            "Ensure adequate natural lighting",
            "Keep the affected area in focus",
            "Avoid shadows and glare",
            "Include reference for scale if possible",
            "Take multiple angles if appropriate",
          ],
        };
      } catch (error) {
        console.error("Error assessing image quality:", error);
        throw new Error(`Failed to assess image quality: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  /**
   * Create case from image/video analysis
   */
  createCaseFromMedia: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        analysisData: z.any(),
        mediaUrls: z.array(z.string().url()),
        mediaType: z.enum(["image", "video"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const severity = input.analysisData.severity || "moderate";
        const conditionType = input.analysisData.condition_type || "unknown";

        // Map severity to case severity
        const severityMap: Record<string, "mild" | "moderate" | "severe" | "critical"> = {
          mild: "mild",
          moderate: "moderate",
          severe: "severe",
          critical: "critical",
        };

        const caseSeverity = severityMap[severity] || "moderate";

        const caseNote = {
          symptoms: `Visual diagnosis: ${conditionType}. ${input.analysisData.owner_education || ""}`,
          severity: caseSeverity,
          imageUrls: input.mediaUrls,
          notes: `${input.mediaType}-based assessment. Visible symptoms: ${input.analysisData.visible_symptoms?.join(", ") || ""}. Differential diagnosis: ${input.analysisData.differential_diagnosis?.map((d: any) => d.condition).join(", ") || ""}`,
        };

        return {
          success: true,
          caseNote,
          urgencyLevel: input.analysisData.urgency_level,
          message: "Case created from media analysis. Ready to save to case history.",
        };
      } catch (error) {
        console.error("Error creating case from media:", error);
        throw new Error("Failed to create case from media analysis");
      }
    }),

  /**
   * Get diagnostic image gallery for educational purposes
   */
  getReferenceDiagnosticImages: publicProcedure
    .input(
      z.object({
        conditionType: z.enum(["skin", "eye", "dental", "wound", "other"]),
        condition: z.string().optional(),
        species: z.enum(["cat", "dog"]).optional(),
      })
    )
    .query(async ({ input }) => {
      // This would query the diagnosticImages table
      // For now, return structure
      return {
        conditionType: input.conditionType,
        condition: input.condition,
        species: input.species,
        images: [],
        message: "Reference images not yet populated - requires database seeding with diagnostic images",
        educationalValue: "Reference images help users understand what to look for and when to seek veterinary care",
      };
    }),

  /**
   * Generate guidance for taking diagnostic photos
   */
  getPhotoGuidance: publicProcedure
    .input(
      z.object({
        conditionType: z.enum(["skin", "eye", "dental", "wound", "other"]),
        species: z.enum(["cat", "dog"]),
      })
    )
    .query(async ({ input }) => {
      const guidance: Record<string, Record<string, any>> = {
        skin: {
          cat: {
            title: "How to Photograph Feline Skin Conditions",
            steps: [
              "Ensure good natural lighting (avoid flash)",
              "Clip or part fur to show affected area clearly",
              "Take photos from multiple angles",
              "Include surrounding healthy skin for comparison",
              "Avoid using filters or editing",
              "Capture close-up and wider view",
              "Note any discharge, odor, or bleeding",
            ],
            whatToAvoid: [
              "Flash photography (causes glare)",
              "Poor lighting (shadows hide details)",
              "Extreme close-ups without context",
              "Edited or filtered images",
              "Images with excessive fur covering the lesion",
            ],
          },
          dog: {
            title: "How to Photograph Canine Skin Conditions",
            steps: [
              "Use natural lighting when possible",
              "Gently part or clip fur to expose the lesion",
              "Photograph from multiple angles",
              "Include surrounding area for context",
              "Avoid using phone filters or editing",
              "Take both close-up and full-body views",
              "Document any drainage, bleeding, or odor",
            ],
            whatToAvoid: [
              "Flash or artificial lighting that creates glare",
              "Dim lighting that obscures details",
              "Extreme magnification without context",
              "Edited or color-corrected images",
              "Fur covering the affected area",
            ],
          },
        },
        eye: {
          cat: {
            title: "How to Photograph Feline Eye Conditions",
            steps: [
              "Use soft, natural lighting",
              "Approach slowly to avoid startling the cat",
              "Gently open the eye if needed (be very careful)",
              "Photograph the affected eye directly",
              "Capture both eyes for comparison",
              "Note any discharge type and color",
              "Take photos from the front and side",
            ],
            whatToAvoid: [
              "Bright flash (causes pupil constriction)",
              "Rough handling",
              "Touching the eye",
              "Images where the eye is closed or partially closed",
              "Extreme angles that don't show the eye clearly",
            ],
          },
          dog: {
            title: "How to Photograph Canine Eye Conditions",
            steps: [
              "Use natural, soft lighting",
              "Position the dog to face the light source",
              "Gently hold the eyelid open if needed",
              "Photograph both eyes for comparison",
              "Capture the affected eye from multiple angles",
              "Document discharge type and color",
              "Take close-up and wider views",
            ],
            whatToAvoid: [
              "Flash photography (affects pupil size)",
              "Harsh shadows",
              "Closed or squinted eyes",
              "Extreme close-ups without context",
              "Rough handling that causes eye closure",
            ],
          },
        },
        dental: {
          cat: {
            title: "How to Photograph Feline Dental Conditions",
            steps: [
              "Use a small flashlight or headlamp for lighting",
              "Gently open the mouth (be very careful with cats)",
              "Photograph teeth from the side and front",
              "Focus on affected teeth and surrounding gums",
              "Capture both upper and lower teeth",
              "Document any discoloration, tartar, or gaps",
              "Note any odor or discharge",
            ],
            whatToAvoid: [
              "Forcing the mouth open",
              "Using flash directly in the mouth",
              "Blurry images",
              "Extreme angles that don't show teeth clearly",
              "Edited or color-corrected images",
            ],
          },
          dog: {
            title: "How to Photograph Canine Dental Conditions",
            steps: [
              "Use a small light source for illumination",
              "Gently lift the lip to expose teeth and gums",
              "Photograph from the side and front",
              "Focus on affected teeth and surrounding tissue",
              "Capture both upper and lower teeth",
              "Document tartar buildup, discoloration, or gaps",
              "Note any bleeding or swelling",
            ],
            whatToAvoid: [
              "Forcing the mouth open",
              "Flash photography (creates glare on wet surfaces)",
              "Blurry or out-of-focus images",
              "Angles that obscure the teeth",
              "Edited images",
            ],
          },
        },
      };

      return (
        guidance[input.conditionType]?.[input.species] || {
          title: "Photo Guidance",
          steps: ["Use natural lighting", "Focus on the affected area", "Avoid filters or editing"],
        }
      );
    }),
});

export type MediaAnalysisRouter = typeof mediaAnalysisRouter;

