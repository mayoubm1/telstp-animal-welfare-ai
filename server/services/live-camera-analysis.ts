/**
 * Live Camera Feed Analysis Service
 * Provides real-time symptom detection from continuous camera stream
 */

import { invokeLLM } from "../_core/llm";

export interface LiveAnalysisFrame {
  timestamp: number;
  base64Image: string;
  frameNumber: number;
}

export interface LiveAnalysisResult {
  frameNumber: number;
  timestamp: number;
  detectedSymptoms: DetectedSymptom[];
  overallHealth: "normal" | "concerning" | "critical";
  confidence: number;
  recommendations: string[];
  shouldAlert: boolean;
  alertReason?: string;
}

export interface DetectedSymptom {
  name: string;
  nameAr: string;
  confidence: number;
  severity: "mild" | "moderate" | "severe";
  location?: string;
  locationAr?: string;
}

const REAL_TIME_SYMPTOMS = {
  limping: {
    name: "Limping",
    nameAr: "العرج",
    severity: "moderate",
  },
  excessive_scratching: {
    name: "Excessive Scratching",
    nameAr: "حك مفرط",
    severity: "moderate",
  },
  lethargy: {
    name: "Lethargy/Inactivity",
    nameAr: "الخمول",
    severity: "moderate",
  },
  labored_breathing: {
    name: "Labored Breathing",
    nameAr: "صعوبة التنفس",
    severity: "severe",
  },
  swelling: {
    name: "Visible Swelling",
    nameAr: "تورم مرئي",
    severity: "moderate",
  },
  discharge: {
    name: "Abnormal Discharge",
    nameAr: "إفرازات غير طبيعية",
    severity: "moderate",
  },
  trembling: {
    name: "Trembling/Shaking",
    nameAr: "الارتجاج",
    severity: "moderate",
  },
  seizure_activity: {
    name: "Seizure Activity",
    nameAr: "نشاط تشنجي",
    severity: "severe",
  },
  excessive_drooling: {
    name: "Excessive Drooling",
    nameAr: "سيلان مفرط",
    severity: "moderate",
  },
  loss_of_consciousness: {
    name: "Loss of Consciousness",
    nameAr: "فقدان الوعي",
    severity: "severe",
  },
};

/**
 * Analyze a single frame from live camera feed
 */
export async function analyzeCameraFrame(
  base64Image: string,
  frameNumber: number,
  petInfo?: string
): Promise<LiveAnalysisResult> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert veterinary diagnostician analyzing real-time pet video feed.
          Identify any visible symptoms or health concerns in this frame.
          
          Respond with JSON:
          {
            "detectedSymptoms": [{"name": "symptom", "confidence": 0.0-1.0, "severity": "mild|moderate|severe"}],
            "overallHealth": "normal|concerning|critical",
            "confidence": 0.0-1.0,
            "shouldAlert": true|false,
            "alertReason": "reason if alert",
            "recommendations": ["rec1", "rec2"]
          }`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this pet video frame for health symptoms. ${petInfo ? `Pet info: ${petInfo}` : ""}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "live_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              detectedSymptoms: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    confidence: { type: "number" },
                    severity: { type: "string", enum: ["mild", "moderate", "severe"] },
                  },
                  required: ["name", "confidence", "severity"],
                },
              },
              overallHealth: { type: "string", enum: ["normal", "concerning", "critical"] },
              confidence: { type: "number" },
              shouldAlert: { type: "boolean" },
              alertReason: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } },
            },
            required: ["detectedSymptoms", "overallHealth", "confidence", "shouldAlert", "recommendations"],
          },
        },
      },
    });

    const analysisText =
      typeof response.choices?.[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : JSON.stringify(response);

    const analysis = JSON.parse(analysisText);

    // Map symptoms to detailed information
    const detailedSymptoms: DetectedSymptom[] = analysis.detectedSymptoms.map((sym: any) => {
      const symptomKey = Object.keys(REAL_TIME_SYMPTOMS).find(
        (key) =>
          REAL_TIME_SYMPTOMS[key as keyof typeof REAL_TIME_SYMPTOMS].name.toLowerCase().includes(sym.name.toLowerCase()) ||
          sym.name.toLowerCase().includes(REAL_TIME_SYMPTOMS[key as keyof typeof REAL_TIME_SYMPTOMS].name.toLowerCase())
      );

      if (symptomKey) {
        const symptomData = REAL_TIME_SYMPTOMS[symptomKey as keyof typeof REAL_TIME_SYMPTOMS];
        return {
          name: symptomData.name,
          nameAr: symptomData.nameAr,
          confidence: sym.confidence,
          severity: sym.severity,
        };
      }

      return {
        name: sym.name,
        nameAr: sym.name,
        confidence: sym.confidence,
        severity: sym.severity,
      };
    });

    return {
      frameNumber,
      timestamp: Date.now(),
      detectedSymptoms: detailedSymptoms,
      overallHealth: analysis.overallHealth,
      confidence: analysis.confidence,
      recommendations: analysis.recommendations,
      shouldAlert: analysis.shouldAlert,
      alertReason: analysis.alertReason,
    };
  } catch (error) {
    console.error("Error analyzing camera frame:", error);
    throw new Error("Failed to analyze camera frame");
  }
}

/**
 * Analyze multiple frames for trend detection
 */
export function analyzeTrends(results: LiveAnalysisResult[]): {
  trend: "improving" | "stable" | "worsening";
  averageHealth: number;
  criticalFrames: number;
  recommendations: string[];
} {
  if (results.length === 0) {
    return {
      trend: "stable",
      averageHealth: 100,
      criticalFrames: 0,
      recommendations: [],
    };
  }

  const healthScores = results.map((r) => {
    if (r.overallHealth === "critical") return 0;
    if (r.overallHealth === "concerning") return 50;
    return 100;
  });

  const averageHealth = (healthScores.reduce((a: number, b: number) => a + b, 0) as number) / healthScores.length;
  const criticalFrames = results.filter((r) => r.overallHealth === "critical").length;

  // Determine trend
  let trend: "improving" | "stable" | "worsening" = "stable";
  if (results.length >= 3) {
    const recentAvg = (healthScores.slice(-3).reduce((a: number, b: number) => a + b, 0) as number) / 3;
    const olderAvg = (healthScores.slice(0, -3).reduce((a: number, b: number) => a + b, 0) as number) / (healthScores.length - 3);
    if (recentAvg > olderAvg + 10) trend = "improving";
    else if (recentAvg < olderAvg - 10) trend = "worsening";
  }

  const recommendations: string[] = [];
  if (trend === "worsening") {
    recommendations.push("⚠️ Pet's condition appears to be worsening - consider veterinary consultation");
  }
  if (criticalFrames > 0) {
    recommendations.push("🚨 Critical symptoms detected - seek immediate veterinary care");
  }
  if (averageHealth < 50) {
    recommendations.push("Pet shows concerning symptoms - schedule veterinary appointment");
  }

  return {
    trend,
    averageHealth,
    criticalFrames,
    recommendations,
  };
}

/**
 * Get real-time analysis recommendations
 */
export function getRealTimeRecommendations(result: LiveAnalysisResult): string[] {
  const recommendations: string[] = [...result.recommendations];

  if (result.shouldAlert) {
    recommendations.unshift(`🚨 Alert: ${result.alertReason || "Concerning symptoms detected"}`);
  }

  if (result.overallHealth === "critical") {
    recommendations.unshift("CRITICAL: Seek immediate veterinary care");
  }

  if (result.detectedSymptoms.length > 0) {
    const severeSymptoms = result.detectedSymptoms.filter((s) => s.severity === "severe");
    if (severeSymptoms.length > 0) {
      recommendations.unshift(`Severe symptoms detected: ${severeSymptoms.map((s) => s.name).join(", ")}`);
    }
  }

  return recommendations;
}
