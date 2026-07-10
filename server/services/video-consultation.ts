/**
 * Video Consultation & Recording Service
 * Handles video uploads, processing, and consultation recordings
 */

import { storagePut, storageGet } from "../storage";

export interface VideoUpload {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  duration: number;
  mimeType: string;
  uploadedAt: number;
  s3Key: string;
  s3Url: string;
  status: "uploading" | "processing" | "ready" | "failed";
  thumbnailUrl?: string;
  transcription?: string;
  analysis?: VideoAnalysis;
}

export interface ConsultationRecording {
  id: string;
  consultationId: string;
  veterinarianId: string;
  userId: string;
  recordingUrl: string;
  duration: number;
  recordedAt: number;
  notes: string;
  notesAr: string;
  recommendations: string[];
  recommendationsAr: string[];
  status: "recording" | "processing" | "completed" | "archived";
}

export interface VideoAnalysis {
  duration: number;
  frameRate: number;
  resolution: string;
  codec: string;
  hasAudio: boolean;
  audioLanguage?: string;
  quality: "excellent" | "good" | "fair" | "poor";
  issues: string[];
  issuesAr: string[];
}

/**
 * Upload video file to S3
 */
export async function uploadVideo(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  userId: string
): Promise<VideoUpload> {
  try {
    // Generate unique key with timestamp
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const s3Key = `videos/${userId}/${timestamp}-${randomSuffix}-${fileName}`;

    // Upload to S3
    const { url: s3Url } = await storagePut(s3Key, fileBuffer, mimeType);

    const videoUpload: VideoUpload = {
      id: `vid_${timestamp}_${randomSuffix}`,
      userId,
      fileName,
      fileSize: fileBuffer.length,
      duration: 0, // Would be calculated from video metadata
      mimeType,
      uploadedAt: timestamp,
      s3Key,
      s3Url,
      status: "processing",
    };

    return videoUpload;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw new Error("Failed to upload video");
  }
}

/**
 * Get video download URL with expiration
 */
export async function getVideoUrl(s3Key: string, _expiresIn: number = 3600): Promise<string> {
  try {
    const { url } = await storageGet(s3Key);
    return url;
  } catch (error) {
    console.error("Error getting video URL:", error);
    throw new Error("Failed to get video URL");
  }
}

/**
 * Create consultation recording
 */
export async function createConsultationRecording(
  consultationId: string,
  veterinarianId: string,
  userId: string,
  recordingBuffer: Buffer,
  fileName: string,
  notes: string,
  notesAr: string,
  recommendations: string[],
  recommendationsAr: string[]
): Promise<ConsultationRecording> {
  try {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const s3Key = `consultations/${consultationId}/${timestamp}-${randomSuffix}-${fileName}`;

    // Upload recording to S3
    const { url: recordingUrl } = await storagePut(s3Key, recordingBuffer, "video/mp4");

    const recording: ConsultationRecording = {
      id: `rec_${timestamp}_${randomSuffix}`,
      consultationId,
      veterinarianId,
      userId,
      recordingUrl,
      duration: 0, // Would be calculated from video metadata
      recordedAt: timestamp,
      notes,
      notesAr,
      recommendations,
      recommendationsAr,
      status: "completed",
    };

    return recording;
  } catch (error) {
    console.error("Error creating consultation recording:", error);
    throw new Error("Failed to create consultation recording");
  }
}

/**
 * Analyze video metadata
 */
export async function analyzeVideoMetadata(_s3Url: string): Promise<VideoAnalysis> {
  try {
    // In a real implementation, this would use FFmpeg or similar
    // For now, return mock analysis
    return {
      duration: 300, // 5 minutes
      frameRate: 30,
      resolution: "1920x1080",
      codec: "h264",
      hasAudio: true,
      audioLanguage: "en",
      quality: "good",
      issues: [],
      issuesAr: [],
    };
  } catch (error) {
    console.error("Error analyzing video metadata:", error);
    throw new Error("Failed to analyze video metadata");
  }
}

/**
 * Generate video thumbnail
 */
export async function generateVideoThumbnail(_s3Url: string, userId: string): Promise<string> {
  try {
    // In a real implementation, this would extract a frame from the video
    // For now, return a placeholder
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const thumbnailKey = `thumbnails/${userId}/${timestamp}-${randomSuffix}.jpg`;

    // Return presigned URL for thumbnail
    const { url } = await storageGet(thumbnailKey);
    return url;
  } catch (error) {
    console.error("Error generating video thumbnail:", error);
    throw new Error("Failed to generate video thumbnail");
  }
}

/**
 * Archive old recordings (move to cold storage)
 */
export async function archiveRecording(s3Key: string): Promise<void> {
  try {
    // In a real implementation, this would move the file to cold storage
    // For now, just log the action
    console.log(`Archived recording: ${s3Key}`);
  } catch (error) {
    console.error("Error archiving recording:", error);
    throw new Error("Failed to archive recording");
  }
}

/**
 * Get video quality recommendations
 */
export function getVideoQualityRecommendations(analysis: VideoAnalysis): string[] {
  const recommendations: string[] = [];

  if (analysis.quality === "poor") {
    recommendations.push("Video quality is poor - consider re-recording in better lighting");
  }

  if (analysis.resolution !== "1920x1080" && analysis.resolution !== "1280x720") {
    recommendations.push("Optimal resolution is 1080p or 720p");
  }

  if (!analysis.hasAudio) {
    recommendations.push("No audio detected - ensure microphone is enabled");
  }

  if (analysis.issues.length > 0) {
    recommendations.push(`Issues detected: ${analysis.issues.join(", ")}`);
  }

  return recommendations;
}
