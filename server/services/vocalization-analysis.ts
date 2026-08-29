import { invokeLLM } from "../_core/llm";

export interface VocalizationAnalysis {
  audioUrl: string;
  duration: number;
  petSpecies: "dog" | "cat";
  vocalizationType: string;
  vocalizationTypeAr: string;
  frequency: number;
  intensity: number;
  emotionalState: "distressed" | "happy" | "playful" | "anxious" | "hungry" | "alert" | "normal";
  emotionalStateAr: string;
  healthIndicators: HealthIndicator[];
  confidence: number;
  recommendations: string[];
  recommendationsAr: string[];
  shouldAlert: boolean;
  alertReason?: string;
}

export interface HealthIndicator {
  name: string;
  nameAr: string;
  severity: "low" | "medium" | "high";
  description: string;
  descriptionAr: string;
  possibleCauses: string[];
  possibleCausesAr: string[];
}

export async function analyzeVocalization(
  audioUrl: string,
  petSpecies: "dog" | "cat",
  duration: number,
  additionalContext?: string
): Promise<VocalizationAnalysis> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert in pet vocalization analysis. Analyze this ${petSpecies} vocalization and provide health and behavioral insights.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ${petSpecies} vocalization. Duration: ${duration}s. ${additionalContext || ""}`,
            },
            {
              type: "file_url",
              file_url: {
                url: audioUrl,
                mime_type: "audio/mpeg",
              },
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "vocalization_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              vocalizationType: { type: "string" },
              emotionalState: {
                type: "string",
                enum: ["distressed", "happy", "playful", "anxious", "hungry", "alert", "normal"],
              },
              frequency: { type: "number" },
              intensity: { type: "number" },
              healthIndicators: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                    description: { type: "string" },
                    possibleCauses: { type: "array", items: { type: "string" } },
                  },
                  required: ["name", "severity", "description", "possibleCauses"],
                },
              },
              confidence: { type: "number" },
              shouldAlert: { type: "boolean" },
              recommendations: { type: "array", items: { type: "string" } },
            },
            required: [
              "vocalizationType",
              "emotionalState",
              "frequency",
              "intensity",
              "healthIndicators",
              "confidence",
              "shouldAlert",
              "recommendations",
            ],
          },
        },
      },
    });

    const analysisText =
      typeof response.choices?.[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : JSON.stringify(response);

    const analysis = JSON.parse(analysisText);

    const emotionalStateMap: Record<string, string> = {
      distressed: "منزعج",
      happy: "سعيد",
      playful: "مرح",
      anxious: "قلق",
      hungry: "جائع",
      alert: "متيقظ",
      normal: "عادي",
    };

    return {
      audioUrl,
      duration,
      petSpecies,
      vocalizationType: analysis.vocalizationType,
      vocalizationTypeAr: analysis.vocalizationType,
      frequency: analysis.frequency,
      intensity: analysis.intensity,
      emotionalState: analysis.emotionalState,
      emotionalStateAr: emotionalStateMap[analysis.emotionalState] || analysis.emotionalState,
      healthIndicators: analysis.healthIndicators.map((indicator: any) => ({
        name: indicator.name,
        nameAr: indicator.name,
        severity: indicator.severity,
        description: indicator.description,
        descriptionAr: indicator.description,
        possibleCauses: indicator.possibleCauses,
        possibleCausesAr: indicator.possibleCauses,
      })),
      confidence: analysis.confidence,
      recommendations: analysis.recommendations,
      recommendationsAr: analysis.recommendations,
      shouldAlert: analysis.shouldAlert,
      alertReason: analysis.shouldAlert ? "Concerning vocalization patterns detected" : undefined,
    };
  } catch (error) {
    console.error("Error analyzing vocalization:", error);
    throw new Error("Failed to analyze vocalization");
  }
}

export function analyzeVocalizationTrends(
  analyses: VocalizationAnalysis[]
): {
  averageIntensity: number;
  dominantEmotionalState: string;
  healthConcerns: string[];
  trend: "improving" | "stable" | "worsening";
  recommendations: string[];
} {
  if (analyses.length === 0) {
    return {
      averageIntensity: 0,
      dominantEmotionalState: "unknown",
      healthConcerns: [],
      trend: "stable",
      recommendations: [],
    };
  }

  const averageIntensity = analyses.reduce((sum, a) => sum + a.intensity, 0) / analyses.length;

  const emotionalStates = analyses.map((a) => a.emotionalState);
  const dominantEmotionalState =
    emotionalStates.sort(
      (a, b) =>
        emotionalStates.filter((v) => v === a).length - emotionalStates.filter((v) => v === b).length
    ).pop() || "unknown";

  const healthConcerns = Array.from(
    new Set(analyses.flatMap((a) => a.healthIndicators.map((h) => h.name)))
  );

  const distressCount = analyses.filter(
    (a) => a.emotionalState === "distressed" || a.emotionalState === "anxious"
  ).length;

  let trend: "improving" | "stable" | "worsening" = "stable";
  if (distressCount > analyses.length * 0.5) {
    trend = "worsening";
  } else if (distressCount < analyses.length * 0.2) {
    trend = "improving";
  }

  const recommendations: string[] = [];
  if (trend === "worsening") {
    recommendations.push(
      "⚠️ Pet's vocalization patterns indicate increasing distress - consider veterinary consultation"
    );
  }
  if (healthConcerns.length > 0) {
    recommendations.push(`Potential health concerns detected: ${healthConcerns.join(", ")}`);
  }

  return {
    averageIntensity,
    dominantEmotionalState,
    healthConcerns,
    trend,
    recommendations,
  };
}
