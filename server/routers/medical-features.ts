/**
 * Medical Features Router
 * tRPC procedures for eye detection, dental detection, live camera analysis, and video consultations
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { analyzeEyeImage, getEyeCareRecommendations } from "../services/eye-detection";
import { analyzeDentalImage, getDentalCareRecommendations } from "../services/dental-detection";
import { analyzeCameraFrame, analyzeTrends, getRealTimeRecommendations } from "../services/live-camera-analysis";
import {
  uploadVideo,
  createConsultationRecording,
  analyzeVideoMetadata,
  generateVideoThumbnail,
  getVideoQualityRecommendations,
} from "../services/video-consultation";
import {
  createCaseEntry,
  createVisualComparison,
  generateCaseTimeline,
  exportCaseAsPDF,
  shareCaseWithVeterinarian,
  getCaseStatistics,
} from "../services/case-history";

export const medicalFeaturesRouter = router({
  // Eye Detection Procedures
  analyzeEyeImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        petInfo: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await analyzeEyeImage(input.imageUrl, input.petInfo);
      const recommendations = getEyeCareRecommendations(result);
      return { ...result, recommendations };
    }),

  // Dental Detection Procedures
  analyzeDentalImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        petInfo: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await analyzeDentalImage(input.imageUrl, input.petInfo);
      const recommendations = getDentalCareRecommendations(result);
      return { ...result, recommendations };
    }),

  // Live Camera Analysis Procedures
  analyzeCameraFrame: protectedProcedure
    .input(
      z.object({
        base64Image: z.string(),
        frameNumber: z.number(),
        petInfo: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await analyzeCameraFrame(input.base64Image, input.frameNumber, input.petInfo);
      const recommendations = getRealTimeRecommendations(result);
      return { ...result, recommendations };
    }),

  analyzeCameraFrameTrends: protectedProcedure
    .input(
      z.object({
        frameResults: z.array(
          z.object({
            frameNumber: z.number(),
            timestamp: z.number(),
            overallHealth: z.enum(["normal", "concerning", "critical"]),
          })
        ),
      })
    )
    .query(({ input }) => {
      // Map to LiveAnalysisResult format for trend analysis
      const results = input.frameResults.map((r) => ({
        frameNumber: r.frameNumber,
        timestamp: r.timestamp,
        detectedSymptoms: [],
        overallHealth: r.overallHealth,
        confidence: 0.8,
        recommendations: [],
        shouldAlert: r.overallHealth !== "normal",
      }));

      return analyzeTrends(results);
    }),

  // Video Upload & Consultation Procedures
  uploadVideo: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileBuffer: z.string(), // Base64 encoded
        mimeType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const fileBuffer = Buffer.from(input.fileBuffer, "base64");
      const videoUpload = await uploadVideo(fileBuffer, input.fileName, input.mimeType, String(ctx.user.id));
      const metadata = await analyzeVideoMetadata(videoUpload.s3Url);
      const qualityRecommendations = getVideoQualityRecommendations(metadata);

      return {
        ...videoUpload,
        analysis: metadata,
        qualityRecommendations,
      };
    }),

  createConsultationRecording: protectedProcedure
    .input(
      z.object({
        consultationId: z.string(),
        veterinarianId: z.string(),
        recordingBuffer: z.string(), // Base64 encoded
        fileName: z.string(),
        notes: z.string(),
        notesAr: z.string(),
        recommendations: z.array(z.string()),
        recommendationsAr: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const recordingBuffer = Buffer.from(input.recordingBuffer, "base64");
      const recording = await createConsultationRecording(
        input.consultationId,
        input.veterinarianId,
        String(ctx.user.id),
        recordingBuffer,
        input.fileName,
        input.notes,
        input.notesAr,
        input.recommendations,
        input.recommendationsAr
      );

      return recording;
    }),

  // Case History Procedures
  createCaseEntry: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        condition: z.string(),
        conditionAr: z.string(),
        severity: z.enum(["mild", "moderate", "severe", "critical"]),
        symptoms: z.array(z.string()),
        symptomsAr: z.array(z.string()),
        treatment: z.string(),
        treatmentAr: z.string(),
        notes: z.string(),
        notesAr: z.string(),
        imageUrls: z.array(z.string()).optional(),
        videoUrls: z.array(z.string()).optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return createCaseEntry(
        input.petId,
        String(ctx.user?.id || ""),
        input.condition,
        input.conditionAr,
        input.severity,
        input.symptoms,
        input.symptomsAr,
        input.treatment,
        input.treatmentAr,
        input.notes,
        input.notesAr,
        input.imageUrls || [],
        input.videoUrls || []
      );
    }),

  createVisualComparison: protectedProcedure
    .input(
      z.object({
        caseId: z.string(),
        beforeImageUrl: z.string().url(),
        afterImageUrl: z.string().url(),
        beforeDate: z.number(),
        afterDate: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await createVisualComparison(
        input.caseId,
        input.beforeImageUrl,
        input.afterImageUrl,
        input.beforeDate,
        input.afterDate
      );
    }),

  generateCaseTimeline: protectedProcedure
    .input(
      z.object({
        entries: z.array(
          z.object({
            id: z.string(),
            petId: z.string(),
            userId: z.string(),
            createdAt: z.number(),
            condition: z.string(),
            conditionAr: z.string(),
            severity: z.enum(["mild", "moderate", "severe", "critical"]),
            symptoms: z.array(z.string()),
            symptomsAr: z.array(z.string()),
            treatment: z.string(),
            treatmentAr: z.string(),
            notes: z.string(),
            notesAr: z.string(),
            imageUrls: z.array(z.string()),
            videoUrls: z.array(z.string()),
            status: z.enum(["active", "improving", "stable", "resolved"]),
          })
        ),
      })
    )
    .query(({ input }) => {
      return generateCaseTimeline(input.entries);
    }),

  exportCaseAsPDF: protectedProcedure
    .input(
      z.object({
        caseId: z.string(),
        entries: z.array(
          z.object({
            id: z.string(),
            condition: z.string(),
            severity: z.enum(["mild", "moderate", "severe", "critical"]),
            createdAt: z.number(),
            notes: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const pdfUrl = await exportCaseAsPDF(input.entries as any);
      return { pdfUrl, caseId: input.caseId };
    }),

  shareCaseWithVeterinarian: protectedProcedure
    .input(
      z.object({
        caseId: z.string(),
        veterinarianId: z.string(),
        accessLevel: z.enum(["view", "comment", "edit"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await shareCaseWithVeterinarian(input.caseId, input.veterinarianId, input.accessLevel || "view");
    }),

  getCaseStatistics: protectedProcedure
    .input(
      z.object({
        entries: z.array(
          z.object({
            condition: z.string(),
            severity: z.enum(["mild", "moderate", "severe", "critical"]),
            status: z.enum(["active", "improving", "stable", "resolved"]),
          })
        ),
      })
    )
    .query(({ input }) => {
      return getCaseStatistics(input.entries as any);
    }),
});
