import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { vocalizationRouter } from "./vocalization-router";
import { mediaAnalysisRouter } from "./media-analysis-router";
import { knowledgeBaseRouter } from "./knowledge-base-router";
import { diagnosisRouter } from "./routers/diagnosis";
import { petsRouter } from "./routers/pets";
import { imageAnalysisRouter } from "./routers/image-analysis";
import { consultationsRouter } from "./routers/consultations";
import { veterinariansRouter } from "./routers/veterinarians";
import { emergencyTriageRouter } from "./routers/emergency-triage";
import { clinicsRouter } from "./routers/clinics";
import { naturalAlternativesRouter } from "./routers/natural-alternatives";
import { trainingProgramsRouter } from "./routers/training-programs";
import { bestPracticesRouter } from "./routers/best-practices";
import { petFileSharingRouter } from "./routers/pet-file-sharing";
import { virtualPetAvatarRouter } from "./routers/virtual-pet-avatar";
import {
  createPet,
  getPetsByUserId,
  getPetById,
  updatePet,
  createCaseHistory,
  getCaseHistoryByPetId,
  getCaseHistoryById,
  updateCaseHistory,
  searchDiseases,
  getDiseaseById,
  getDiseasesByCategory,
  searchEducationalContent,
  getEducationalContentByCategory,
  createConsultation,
  getConsultationsByVeterinarian,
  getConsultationById,
  updateConsultation,
  searchVetClinics,
  getVetClinicById,
  getNotificationsByUserId,
  markNotificationAsRead,
  createNotification,
  getCriticalCases,
  getVeterinarianByUserId,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ PET MANAGEMENT ============
  pets: petsRouter,
  imageAnalysis: imageAnalysisRouter,
  consultations: consultationsRouter,
  veterinarians: veterinariansRouter,
  emergencyTriage: emergencyTriageRouter,
  clinics: clinicsRouter,

  // Legacy pets router (deprecated)
  petsLegacy: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          species: z.enum(["cat", "dog"]),
          breed: z.string().optional(),
          age: z.number().optional(),
          weight: z.number().optional(),
          color: z.string().optional(),
          microchipId: z.string().optional(),
          medicalHistory: z.string().optional(),
          allergies: z.string().optional(),
          currentMedications: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await createPet({
          userId: ctx.user.id,
          name: input.name,
          species: input.species,
          breed: input.breed,
          age: input.age,
          weight: input.weight ? String(input.weight) : undefined,
          color: input.color,
          microchipId: input.microchipId,
          medicalHistory: input.medicalHistory,
          allergies: input.allergies,
          currentMedications: input.currentMedications,
        });
        return result;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getPetsByUserId(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ petId: z.number() }))
      .query(async ({ input }) => {
        return await getPetById(input.petId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          petId: z.number(),
          updates: z.object({
            name: z.string().optional(),
            breed: z.string().optional(),
            age: z.number().optional(),
            weight: z.number().optional(),
            color: z.string().optional(),
            vaccinationStatus: z.enum(["up_to_date", "overdue", "unknown"]).optional(),
            lastVaccinationDate: z.date().optional(),
            medicalHistory: z.string().optional(),
            allergies: z.string().optional(),
            currentMedications: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const updates: any = { ...input.updates };
        if (updates.weight) {
          updates.weight = String(updates.weight);
        }
        return await updatePet(input.petId, updates);
      }),
  }),

  // ============ CASE HISTORY & DIAGNOSIS ============
  cases: router({
    create: protectedProcedure
      .input(
        z.object({
          petId: z.number(),
          symptoms: z.string(),
          symptomOnsetDate: z.date().optional(),
          severity: z.enum(["mild", "moderate", "severe", "critical"]),
          imageUrls: z.array(z.string()).optional(),
          voiceTranscription: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Create the case
        const result = await createCaseHistory({
          petId: input.petId,
          userId: ctx.user.id,
          symptoms: input.symptoms,
          symptomOnsetDate: input.symptomOnsetDate,
          severity: input.severity,
          imageUrls: input.imageUrls ? JSON.stringify(input.imageUrls) : null,
          voiceTranscription: input.voiceTranscription,
          notes: input.notes,
        });

        // Trigger AI diagnosis asynchronously
        const caseId = (result as any).insertId || 0;
        setImmediate(async () => {
          try {
            const pet = await getPetById(input.petId);
            if (!pet) return;

            const aiDiagnosis = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content: `You are a veterinary diagnostic AI assistant specializing in feline and canine medicine. 
                  Analyze the provided symptoms and generate a differential diagnosis with treatment recommendations.
                  Format your response as JSON with fields: likelyConditions (array), severity, recommendedTests, homeCareTips, urgencyLevel.`,
                },
                {
                  role: "user",
                  content: `Pet: ${pet.species} (${pet.breed || "breed unknown"}), Age: ${pet.age || "unknown"} months
                  Symptoms: ${input.symptoms}
                  Onset: ${input.symptomOnsetDate || "unknown"}
                  Severity: ${input.severity}`,
                },
              ],
              response_format: {
                type: "json_schema",
                json_schema: {
                  name: "veterinary_diagnosis",
                  strict: true,
                  schema: {
                    type: "object",
                    properties: {
                      likelyConditions: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of likely conditions",
                      },
                      severity: {
                        type: "string",
                        description: "Overall severity assessment",
                      },
                      recommendedTests: {
                        type: "array",
                        items: { type: "string" },
                        description: "Recommended diagnostic tests",
                      },
                      homeCareTips: {
                        type: "array",
                        items: { type: "string" },
                        description: "Home care recommendations",
                      },
                      urgencyLevel: {
                        type: "string",
                        enum: ["home_care", "urgent_vet", "emergency"],
                        description: "Recommended urgency level",
                      },
                    },
                    required: ["likelyConditions", "severity", "recommendedTests", "homeCareTips", "urgencyLevel"],
                    additionalProperties: false,
                  },
                },
              },
            });

            const diagnosis =
              typeof aiDiagnosis.choices?.[0]?.message?.content === "string"
                ? aiDiagnosis.choices[0].message.content
                : JSON.stringify(aiDiagnosis);

            // Update case with AI diagnosis and triage level
            const parsedDiagnosis = JSON.parse(diagnosis);
            await updateCaseHistory(caseId, {
              aiDiagnosis: diagnosis,
              triageLevel: parsedDiagnosis.urgencyLevel,
            });

            // Notify owner if critical
            if (parsedDiagnosis.urgencyLevel === "emergency") {
              await notifyOwner({
                title: "Critical Case Alert",
                content: `A critical case has been submitted for ${pet.name} (${pet.species}). Symptoms: ${input.symptoms}. Immediate veterinary attention recommended.`,
              });
            }
          } catch (error) {
            console.error("Error generating AI diagnosis:", error);
          }
        });

        return result;
      }),

    list: protectedProcedure
      .input(z.object({ petId: z.number() }))
      .query(async ({ input }) => {
        return await getCaseHistoryByPetId(input.petId);
      }),

    get: protectedProcedure
      .input(z.object({ caseId: z.number() }))
      .query(async ({ input }) => {
        return await getCaseHistoryById(input.caseId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          caseId: z.number(),
          updates: z.object({
            veterinarianDiagnosis: z.string().optional(),
            treatment: z.string().optional(),
            outcome: z.enum(["resolved", "ongoing", "referred", "hospitalized", "unknown"]).optional(),
            followUpDate: z.date().optional(),
            notes: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        return await updateCaseHistory(input.caseId, input.updates);
      }),

    requestConsultation: protectedProcedure
      .input(z.object({ caseId: z.number(), veterinarianId: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const caseData = await getCaseHistoryById(input.caseId);
        if (!caseData) throw new Error("Case not found");

        const result = await createConsultation({
          caseHistoryId: input.caseId,
          petOwnerId: ctx.user.id,
          veterinarianId: input.veterinarianId,
          status: "pending",
        });

        const consultationId = (result as any).insertId || 0;

        // Update case to mark consultation as requested
        await updateCaseHistory(input.caseId, { consultationRequested: true });

        // Notify veterinarian if specified
        if (input.veterinarianId) {
          const vet = await getVeterinarianByUserId(input.veterinarianId);
          if (vet?.userId) {
            await createNotification({
              userId: vet.userId,
              type: "consultation_request",
              title: "New Consultation Request",
              content: `A new consultation request has been submitted for case #${input.caseId}`,
              relatedConsultationId: consultationId,
            });
          }
        }

        return result;
      }),
  }),

  // ============ DISEASE DATABASE ============
  diseases: router({
    search: publicProcedure
      .input(
        z.object({
          query: z.string().optional(),
          category: z.string().optional(),
          species: z.enum(["cat", "dog"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return await searchDiseases(input.query || "", input.category, input.species);
      }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await getDiseasesByCategory(input.category || "");
      }),

    get: publicProcedure
      .input(z.object({ diseaseId: z.number() }))
      .query(async ({ input }) => {
        return await getDiseaseById(input.diseaseId);
      }),
  }),

  // ============ EDUCATIONAL CONTENT ============
  education: router({
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await searchEducationalContent(input.query || "");
      }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await getEducationalContentByCategory(input.category || "");
      }),
  }),

  // ============ VETERINARIAN CONSULTATIONS ============
  // consultations router is imported from ./routers/consultations


  // ============ VET CLINIC FINDER ============
  // clinics router is imported from ./routers/clinics

  // ============ NOTIFICATIONS ============
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getNotificationsByUserId(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        return await markNotificationAsRead(input.notificationId);
      }),
  }),

  // ============ EMERGENCY TRIAGE ============
  triage: router({
    assess: publicProcedure
      .input(
        z.object({
          symptoms: z.string(),
          severity: z.enum(["mild", "moderate", "severe", "critical"]),
          species: z.enum(["cat", "dog"]),
        })
      )
      .query(async ({ input }) => {
        // Use LLM to assess emergency level
        const assessment = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a veterinary emergency triage AI. Assess the urgency level based on symptoms and severity.
              Respond with JSON containing: triageLevel (home_care, urgent_vet, emergency), reasoning, immediateActions, and when to seek help.`,
            },
            {
              role: "user",
              content: `Species: ${input.species}, Severity: ${input.severity}, Symptoms: ${input.symptoms}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "triage_assessment",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  triageLevel: {
                    type: "string",
                    enum: ["home_care", "urgent_vet", "emergency"],
                  },
                  reasoning: { type: "string" },
                  immediateActions: {
                    type: "array",
                    items: { type: "string" },
                  },
                  whenToSeekHelp: { type: "string" },
                },
                required: ["triageLevel", "reasoning", "immediateActions", "whenToSeekHelp"],
                additionalProperties: false,
              },
            },
          },
        });

        const result =
          typeof assessment.choices?.[0]?.message?.content === "string"
            ? JSON.parse(assessment.choices[0].message.content)
            : assessment;

        return result;
      }),
  }),

  // ============ CRITICAL CASES (ADMIN) ============
    // ============ KNOWLEDGE BASE ============
  knowledgeBase: knowledgeBaseRouter,
  diagnosis: diagnosisRouter,
  // ============ NATURAL ALTERNATIVES & MARKETPLACE ============
  naturalAlternatives: naturalAlternativesRouter,
  trainingPrograms: trainingProgramsRouter,
  bestPractices: bestPracticesRouter,
  petFileSharing: petFileSharingRouter,
  virtualPetAvatar: virtualPetAvatarRouter,
  admin: router({
    getCriticalCases: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      return await getCriticalCases();
    }),
  }),
});

export type AppRouter = typeof appRouter;
