/**
 * Eye Condition Detection Service
 * Analyzes pet eye images for common conditions
 */

import { invokeLLM } from "../_core/llm";

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

const COMMON_EYE_CONDITIONS: Record<string, EyeCondition> = {
  conjunctivitis: {
    name: "Conjunctivitis (Pink Eye)",
    nameAr: "التهاب الملتحمة",
    description: "Inflammation of the conjunctiva, often caused by infection or allergy",
    descriptionAr: "التهاب الغشاء المخاطي للعين، غالباً ما يكون بسبب عدوى أو حساسية",
    confidence: 0,
    symptoms: ["Red eyes", "Discharge", "Squinting", "Excessive tearing"],
    symptomsAr: ["احمرار العيون", "إفرازات", "الرمش المتكرر", "الدموع الزائدة"],
    treatmentOptions: ["Antibiotic drops", "Antihistamine drops", "Warm compress", "Veterinary examination"],
    treatmentOptionsAr: ["قطرات مضادة للبكتيريا", "قطرات مضادة للحساسية", "كمادات دافئة", "فحص بيطري"],
  },
  cornealUlcer: {
    name: "Corneal Ulcer",
    nameAr: "قرحة القرنية",
    description: "Erosion of the cornea, potentially serious and requires immediate attention",
    descriptionAr: "تآكل القرنية، قد يكون خطيراً ويتطلب عناية فورية",
    confidence: 0,
    symptoms: ["Severe pain", "Cloudy eye", "Discharge", "Reluctance to open eye"],
    symptomsAr: ["ألم شديد", "عتامة العين", "إفرازات", "عدم الرغبة في فتح العين"],
    treatmentOptions: ["Immediate veterinary care", "Antibiotic ointment", "Pain medication", "E-collar"],
    treatmentOptionsAr: ["عناية بيطرية فورية", "مرهم مضاد للبكتيريا", "مسكنات الألم", "طوق إليزابيثي"],
  },
  cataracts: {
    name: "Cataracts",
    nameAr: "إعتام العدسة",
    description: "Cloudiness of the lens, affecting vision clarity",
    descriptionAr: "عتامة العدسة، تؤثر على وضوح الرؤية",
    confidence: 0,
    symptoms: ["Cloudy lens", "Vision problems", "Bumping into objects", "Dilated pupils"],
    symptomsAr: ["عدسة معتمة", "مشاكل في الرؤية", "الاصطدام بالأشياء", "تمدد الحدقات"],
    treatmentOptions: ["Surgical removal", "Antioxidant supplements", "Regular monitoring", "Veterinary consultation"],
    treatmentOptionsAr: ["الإزالة الجراحية", "مكملات مضادة للأكسدة", "المراقبة المنتظمة", "استشارة بيطرية"],
  },
  dryEye: {
    name: "Dry Eye Syndrome",
    nameAr: "متلازمة جفاف العين",
    description: "Insufficient tear production, causing discomfort and potential damage",
    descriptionAr: "عدم كفاية إنتاج الدموع، مما يسبب عدم الراحة والضرر المحتمل",
    confidence: 0,
    symptoms: ["Dry appearance", "Discharge", "Squinting", "Redness"],
    symptomsAr: ["مظهر جاف", "إفرازات", "الرمش المتكرر", "احمرار"],
    treatmentOptions: ["Artificial tears", "Lubricating ointment", "Medication", "Environmental adjustment"],
    treatmentOptionsAr: ["دموع صناعية", "مرهم مرطب", "الأدوية", "تعديل البيئة"],
  },
  discharge: {
    name: "Eye Discharge",
    nameAr: "إفرازات العين",
    description: "Abnormal discharge from the eye, may indicate infection or irritation",
    descriptionAr: "إفرازات غير طبيعية من العين، قد تشير إلى عدوى أو تهيج",
    confidence: 0,
    symptoms: ["Visible discharge", "Matted fur", "Odor", "Discomfort"],
    symptomsAr: ["إفرازات مرئية", "فراء متشابك", "رائحة", "عدم الراحة"],
    treatmentOptions: ["Gentle cleaning", "Antibiotic drops", "Warm compress", "Veterinary examination"],
    treatmentOptionsAr: ["تنظيف لطيف", "قطرات مضادة للبكتيريا", "كمادات دافئة", "فحص بيطري"],
  },
};

/**
 * Analyze pet eye image for conditions
 */
export async function analyzeEyeImage(imageUrl: string, petInfo?: string): Promise<EyeAnalysisResult> {
  try {
    // Call LLM with image for analysis
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert veterinary ophthalmologist. Analyze the pet eye image and identify any visible conditions.
          
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

    // Map detected conditions to detailed information
    const detailedConditions: EyeCondition[] = analysis.conditions.map((cond: any) => {
      const conditionKey = Object.keys(COMMON_EYE_CONDITIONS).find(
        (key) =>
          COMMON_EYE_CONDITIONS[key].name.toLowerCase().includes(cond.name.toLowerCase()) ||
          cond.name.toLowerCase().includes(COMMON_EYE_CONDITIONS[key].name.toLowerCase())
      );

      if (conditionKey) {
        return {
          ...COMMON_EYE_CONDITIONS[conditionKey],
          confidence: cond.confidence,
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
