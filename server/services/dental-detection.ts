/**
 * Dental Condition Detection Service
 * Analyzes pet dental images for common conditions
 */

import { invokeLLM } from "../_core/llm";
import { getMedicalConditionsByCategory } from "./medical-conditions-db";

export interface DentalAnalysisResult {
  conditions: DentalCondition[];
  severity: "mild" | "moderate" | "severe" | "critical";
  confidence: number;
  recommendations: string[];
  urgency: "routine" | "urgent" | "emergency";
  imageQuality: "excellent" | "good" | "fair" | "poor";
  qualityIssues?: string[];
  teethCount?: number;
  overallOralHealth: "excellent" | "good" | "fair" | "poor";
}

export interface DentalCondition {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  confidence: number;
  affectedTeeth?: string[];
  symptoms: string[];
  symptomsAr: string[];
  treatmentOptions: string[];
  treatmentOptionsAr: string[];
  preventionTips: string[];
  preventionTipsAr: string[];
}

const COMMON_DENTAL_CONDITIONS: Record<string, DentalCondition> = {
  tartar: {
    name: "Tartar Buildup",
    nameAr: "تراكم الجير",
    description: "Hardened plaque on teeth, can lead to gum disease",
    descriptionAr: "طبقة صلبة من البلاك على الأسنان، قد تؤدي إلى أمراض اللثة",
    confidence: 0,
    symptoms: ["Yellow/brown discoloration", "Bad breath", "Visible buildup", "Gum inflammation"],
    symptomsAr: ["تلون أصفر/بني", "رائحة الفم الكريهة", "تراكم مرئي", "التهاب اللثة"],
    treatmentOptions: ["Professional cleaning", "Dental scaling", "Regular brushing", "Dietary changes"],
    treatmentOptionsAr: ["تنظيف احترافي", "كشط الأسنان", "تنظيف منتظم", "تغييرات غذائية"],
    preventionTips: ["Brush teeth regularly", "Use dental chews", "Feed dry food", "Regular vet checkups"],
    preventionTipsAr: ["تنظيف الأسنان بانتظام", "استخدام مضغات الأسنان", "إطعام الطعام الجاف", "فحوصات بيطرية منتظمة"],
  },
  gingivitis: {
    name: "Gingivitis (Gum Disease)",
    nameAr: "التهاب اللثة",
    description: "Inflammation of the gums, early stage of periodontal disease",
    descriptionAr: "التهاب اللثة، المرحلة الأولى من أمراض اللثة",
    confidence: 0,
    symptoms: ["Red gums", "Bleeding when chewing", "Bad breath", "Swollen gums"],
    symptomsAr: ["لثة حمراء", "نزيف عند المضغ", "رائحة الفم الكريهة", "لثة منتفخة"],
    treatmentOptions: ["Professional cleaning", "Antibiotic rinse", "Improved oral hygiene", "Dietary adjustment"],
    treatmentOptionsAr: ["تنظيف احترافي", "غسول مضاد للبكتيريا", "تحسين نظافة الفم", "تعديل النظام الغذائي"],
    preventionTips: ["Daily tooth brushing", "Dental treats", "Regular vet visits", "Avoid hard chewing"],
    preventionTipsAr: ["تنظيف يومي للأسنان", "علاجات الأسنان", "زيارات بيطرية منتظمة", "تجنب المضغ الشديد"],
  },
  toothLoss: {
    name: "Tooth Loss",
    nameAr: "فقدان الأسنان",
    description: "Missing or loose teeth, indicates advanced dental disease",
    descriptionAr: "أسنان مفقودة أو فضفاضة، تشير إلى مرض أسنان متقدم",
    confidence: 0,
    symptoms: ["Visible gaps", "Loose teeth", "Difficulty eating", "Excessive drooling"],
    symptomsAr: ["فجوات مرئية", "أسنان فضفاضة", "صعوبة في الأكل", "سيلان زائد"],
    treatmentOptions: ["Extraction if necessary", "Soft diet", "Pain management", "Preventive care"],
    treatmentOptionsAr: ["الخلع إذا لزم الأمر", "نظام غذائي ناعم", "إدارة الألم", "الرعاية الوقائية"],
    preventionTips: ["Early intervention", "Regular cleaning", "Proper diet", "Avoid trauma"],
    preventionTipsAr: ["التدخل المبكر", "التنظيف المنتظم", "النظام الغذائي الصحيح", "تجنب الإصابات"],
  },
  cavity: {
    name: "Dental Cavity",
    nameAr: "تسوس الأسنان",
    description: "Decay in tooth structure, requires treatment",
    descriptionAr: "تسوس في بنية السن، يتطلب معالجة",
    confidence: 0,
    symptoms: ["Dark spot on tooth", "Sensitivity", "Bad breath", "Visible hole"],
    symptomsAr: ["بقعة داكنة على السن", "حساسية", "رائحة الفم الكريهة", "فتحة مرئية"],
    treatmentOptions: ["Filling", "Root canal", "Extraction", "Fluoride treatment"],
    treatmentOptionsAr: ["حشو", "معالجة قناة الجذر", "الخلع", "معالجة الفلورايد"],
    preventionTips: ["Brush twice daily", "Limit sugary foods", "Use fluoride toothpaste", "Regular checkups"],
    preventionTipsAr: ["تنظيف مرتين يومياً", "تقليل الأطعمة السكرية", "استخدام معجون أسنان بالفلورايد", "فحوصات منتظمة"],
  },
  fracturedTooth: {
    name: "Fractured Tooth",
    nameAr: "سن مكسور",
    description: "Broken or chipped tooth, may expose nerve",
    descriptionAr: "سن مكسور أو مشقوق، قد يكشف العصب",
    confidence: 0,
    symptoms: ["Visible crack or chip", "Pain when eating", "Sensitivity", "Swelling"],
    symptomsAr: ["شقة أو رقاقة مرئية", "ألم عند الأكل", "حساسية", "تورم"],
    treatmentOptions: ["Bonding", "Crown", "Root canal", "Extraction"],
    treatmentOptionsAr: ["الترابط", "التاج", "معالجة قناة الجذر", "الخلع"],
    preventionTips: ["Avoid hard objects", "Don't use teeth as tools", "Protective mouthguard", "Regular care"],
    preventionTipsAr: ["تجنب الأشياء الصلبة", "عدم استخدام الأسنان كأدوات", "واقي الفم", "الرعاية المنتظمة"],
  },
};

/**
 * Analyze pet dental image for conditions
 */
export async function analyzeDentalImage(imageUrl: string, petInfo?: string): Promise<DentalAnalysisResult> {
  try {
    // Get comprehensive dental conditions from database
    const dentalConditions = getMedicalConditionsByCategory("dental");
    const conditionList = dentalConditions
      .map((c) => `${c.name} (${c.nameAr}): ${c.symptoms.join(", ")} - Severity: ${c.severity}`)
      .join("\n");

    // Call LLM with image for analysis
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert veterinary dentist. Analyze the pet dental image and identify any visible conditions from this comprehensive database:

${conditionList}

Respond with a JSON object containing:
          {
            "conditions": [{"name": "condition_name", "confidence": 0.0-1.0, "severity": "mild|moderate|severe|critical"}],
            "severity": "mild|moderate|severe|critical",
            "confidence": 0.0-1.0,
            "urgency": "routine|urgent|emergency",
            "imageQuality": "excellent|good|fair|poor",
            "qualityIssues": ["issue1", "issue2"],
            "teethCount": 32,
            "overallOralHealth": "excellent|good|fair|poor",
            "recommendations": ["rec1", "rec2"]
          }`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this pet dental image. ${petInfo ? `Pet info: ${petInfo}` : ""}`,
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
          name: "dental_analysis",
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
              teethCount: { type: "number" },
              overallOralHealth: { type: "string", enum: ["excellent", "good", "fair", "poor"] },
              recommendations: { type: "array", items: { type: "string" } },
            },
            required: ["conditions", "severity", "confidence", "urgency", "imageQuality", "overallOralHealth", "recommendations"],
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
    const detailedConditions: DentalCondition[] = analysis.conditions.map((cond: any) => {
      const conditionKey = Object.keys(COMMON_DENTAL_CONDITIONS).find(
        (key) =>
          COMMON_DENTAL_CONDITIONS[key].name.toLowerCase().includes(cond.name.toLowerCase()) ||
          cond.name.toLowerCase().includes(COMMON_DENTAL_CONDITIONS[key].name.toLowerCase())
      );

      if (conditionKey) {
        return {
          ...COMMON_DENTAL_CONDITIONS[conditionKey],
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
        preventionTips: [],
        preventionTipsAr: [],
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
      teethCount: analysis.teethCount,
      overallOralHealth: analysis.overallOralHealth,
    };
  } catch (error) {
    console.error("Error analyzing dental image:", error);
    throw new Error("Failed to analyze dental image");
  }
}

/**
 * Get dental care recommendations based on detected conditions
 */
export function getDentalCareRecommendations(result: DentalAnalysisResult): string[] {
  const recommendations: string[] = [...result.recommendations];

  // Add specific recommendations based on urgency
  if (result.urgency === "emergency") {
    recommendations.unshift("🚨 URGENT: Contact your veterinarian immediately");
  } else if (result.urgency === "urgent") {
    recommendations.unshift("⚠️ Schedule a dental appointment within 1-2 weeks");
  }

  // Add recommendations based on overall oral health
  if (result.overallOralHealth === "poor") {
    recommendations.push("Comprehensive dental treatment recommended");
  }

  // Add quality-based recommendations
  if (result.imageQuality === "poor") {
    recommendations.push("Image quality is low - consider retaking photo with better lighting and angle");
  }

  return recommendations;
}
