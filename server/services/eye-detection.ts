/**
 * Eye Condition Detection Service
 * Analyzes pet eye images for common conditions
 * Integrated with comprehensive medical conditions database
 */

import { invokeLLM } from "../_core/llm";
import { getMedicalConditionsByCategory } from "./medical-conditions-db";

export interface EyeAnalysisResult {
  conditions: EyeCondition[];
  severity: "mild" | "moderate" | "severe" | "critical";
  confidence: number;
  recommendations: string[];
  urgency: "routine" | "urgent" | "emergency";
  imageQuality: "excellent" | "good" | "fair" | "poor";
  qualityIssues?: string[];
}

export interface EyeCondition {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  confidence: number;
  symptoms: string[];
  symptomsAr: string[];
  treatmentOptions: string[];
  treatmentOptionsAr: string[];
}

/**
 * Analyze pet eye image for conditions using expanded database
 */
export async function analyzeEyeImage(imageUrl: string, petInfo?: string): Promise<EyeAnalysisResult> {
  try {
    // Get comprehensive eye conditions from database
    const eyeConditions = getMedicalConditionsByCategory("eye");
    const conditionList = eyeConditions
      .map((c) => `${c.name} (${c.nameAr}): ${c.symptoms.join(", ")} - Severity: ${c.severity}`)
      .join("\n");

    // Call LLM with image for analysis
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert veterinary ophthalmologist. Analyze the pet eye image and identify any visible conditions from this comprehensive database:

${conditionList}

Respond with a JSON object containing:
{
  "conditions": [{"name": "condition_name", "confidence": 0.0-1.0, "severity": "mild|moderate|severe|critical"}],
  "severity": "mild|moderate|severe|critical",
  "confidence": 0.0-1.0,
  "urgency": "routine|urgent|emergency",
  "imageQuality": "excellent|good|fair|poor",
  "qualityIssues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"]
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this pet eye image. ${petInfo ? `Pet info: ${petInfo}` : ""}`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "eye_analysis",
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
                    confidence: { type: "number" },
                    severity: { type: "string", enum: ["mild", "moderate", "severe", "critical"] },
                  },
                  required: ["name", "confidence", "severity"],
                },
              },
              severity: { type: "string", enum: ["mild", "moderate", "severe", "critical"] },
              confidence: { type: "number" },
              urgency: { type: "string", enum: ["routine", "urgent", "emergency"] },
              imageQuality: { type: "string", enum: ["excellent", "good", "fair", "poor"] },
              qualityIssues: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
            },
            required: ["conditions", "severity", "confidence", "urgency", "imageQuality", "recommendations"],
          },
        },
      },
    });

    const analysisText =
      typeof response.choices?.[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : JSON.stringify(response);

    const analysis = JSON.parse(analysisText);

    // Map detected conditions to detailed information from database
    const detailedConditions: EyeCondition[] = analysis.conditions.map((cond: any) => {
      const dbCondition = eyeConditions.find(
        (c) =>
          c.name.toLowerCase().includes(cond.name.toLowerCase()) ||
          cond.name.toLowerCase().includes(c.name.toLowerCase())
      );

      if (dbCondition) {
        return {
          name: dbCondition.name,
          nameAr: dbCondition.nameAr,
          description: `${dbCondition.name}: ${dbCondition.treatments.join(", ")}`,
          descriptionAr: `${dbCondition.nameAr}: ${dbCondition.treatmentsAr.join(", ")}`,
          confidence: cond.confidence,
          symptoms: dbCondition.symptoms,
          symptomsAr: dbCondition.symptomsAr,
          treatmentOptions: dbCondition.treatments,
          treatmentOptionsAr: dbCondition.treatmentsAr,
        };
      }

      // Return generic condition if not found
      return {
        name: cond.name,
        nameAr: cond.name,
        description: `Detected condition: ${cond.name}`,
        descriptionAr: `حالة مكتشفة: ${cond.name}`,
        confidence: cond.confidence,
        symptoms: [],
        symptomsAr: [],
        treatmentOptions: [],
        treatmentOptionsAr: [],
      };
    });

    return {
      conditions: detailedConditions,
      severity: analysis.severity,
      confidence: analysis.confidence,
      recommendations: analysis.recommendations,
      urgency: analysis.urgency,
      imageQuality: analysis.imageQuality,
      qualityIssues: analysis.qualityIssues,
    };
  } catch (error) {
    console.error("Error analyzing eye image:", error);
    throw new Error("Failed to analyze eye image");
  }
}

/**
 * Get eye care recommendations based on detected conditions
 */
export function getEyeCareRecommendations(result: EyeAnalysisResult): string[] {
  const recommendations: string[] = [...result.recommendations];

  // Add specific recommendations based on urgency
  if (result.urgency === "emergency") {
    recommendations.unshift("🚨 URGENT: Contact your veterinarian immediately");
  } else if (result.urgency === "urgent") {
    recommendations.unshift("⚠️ Schedule a veterinary appointment today");
  }

  // Add quality-based recommendations
  if (result.imageQuality === "poor") {
    recommendations.push("Image quality is low - consider retaking photo in better lighting");
  }

  return recommendations;
}
