/**
 * Pet Health Tips Service
 * Generates personalized health recommendations based on pet data and conditions
 */

import { invokeLLM } from "../_core/llm";

export interface PetHealthData {
  petId: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "hamster" | "guinea_pig" | "other";
  breed?: string;
  age: number; // in years
  weight: number; // in kg
  currentConditions: string[];
  recentSymptoms: string[];
  vaccinations: string[];
  lastVetVisit?: Date;
  dietType: string;
  activityLevel: "low" | "moderate" | "high";
  healthScore: number; // 0-100
}

export interface HealthTip {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: "nutrition" | "exercise" | "preventive" | "behavior" | "emergency" | "wellness";
  priority: "low" | "medium" | "high" | "critical";
  actionItems: string[];
  actionItemsAr: string[];
  estimatedBenefit: string;
  estimatedBenefitAr: string;
  relatedConditions: string[];
  urgency: "routine" | "soon" | "urgent" | "emergency";
  emoji: string;
}

/**
 * Generate personalized health tips based on pet data
 */
export async function generatePersonalizedHealthTips(petData: PetHealthData): Promise<HealthTip[]> {
  try {
    const prompt = `
You are a veterinary health advisor. Based on the following pet data, generate 5 personalized health tips.

Pet Information:
- Name: ${petData.name}
- Species: ${petData.species}
- Breed: ${petData.breed || "Unknown"}
- Age: ${petData.age} years
- Weight: ${petData.weight} kg
- Current Conditions: ${petData.currentConditions.join(", ") || "None"}
- Recent Symptoms: ${petData.recentSymptoms.join(", ") || "None"}
- Vaccinations: ${petData.vaccinations.join(", ") || "Not specified"}
- Diet Type: ${petData.dietType}
- Activity Level: ${petData.activityLevel}
- Overall Health Score: ${petData.healthScore}/100
- Last Vet Visit: ${petData.lastVetVisit ? new Date(petData.lastVetVisit).toLocaleDateString() : "Unknown"}

Generate health tips in JSON format with the following structure for EACH tip:
{
  "title": "English title",
  "titleAr": "Arabic title",
  "description": "English description",
  "descriptionAr": "Arabic description",
  "category": "nutrition|exercise|preventive|behavior|emergency|wellness",
  "priority": "low|medium|high|critical",
  "actionItems": ["action1", "action2", "action3"],
  "actionItemsAr": ["إجراء1", "إجراء2", "إجراء3"],
  "estimatedBenefit": "English benefit description",
  "estimatedBenefitAr": "Arabic benefit description",
  "relatedConditions": ["condition1", "condition2"],
  "urgency": "routine|soon|urgent|emergency",
  "emoji": "relevant emoji"
}

Return as a JSON array of 5 tips. Prioritize tips based on the pet's current conditions and health score.
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a veterinary health advisor. Generate personalized health tips for pets based on their data. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "health_tips",
          strict: false,
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                titleAr: { type: "string" },
                description: { type: "string" },
                descriptionAr: { type: "string" },
                category: { type: "string" },
                priority: { type: "string" },
                actionItems: { type: "array", items: { type: "string" } },
                actionItemsAr: { type: "array", items: { type: "string" } },
                estimatedBenefit: { type: "string" },
                estimatedBenefitAr: { type: "string" },
                relatedConditions: { type: "array", items: { type: "string" } },
                urgency: { type: "string" },
                emoji: { type: "string" },
              },
            },
          },
        },
      },
    });

    const responseText =
      typeof response.choices?.[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : JSON.stringify(response);

    const tipsData = JSON.parse(responseText);

    // Convert to HealthTip array with IDs
    const healthTips: HealthTip[] = (Array.isArray(tipsData) ? tipsData : tipsData.tips || []).map(
      (tip: any, index: number) => ({
        id: `tip-${Date.now()}-${index}`,
        title: tip.title || "",
        titleAr: tip.titleAr || "",
        description: tip.description || "",
        descriptionAr: tip.descriptionAr || "",
        category: tip.category || "wellness",
        priority: tip.priority || "medium",
        actionItems: Array.isArray(tip.actionItems) ? tip.actionItems : [],
        actionItemsAr: Array.isArray(tip.actionItemsAr) ? tip.actionItemsAr : [],
        estimatedBenefit: tip.estimatedBenefit || "",
        estimatedBenefitAr: tip.estimatedBenefitAr || "",
        relatedConditions: Array.isArray(tip.relatedConditions) ? tip.relatedConditions : [],
        urgency: tip.urgency || "routine",
        emoji: tip.emoji || "🏥",
      })
    );

    return healthTips;
  } catch (error) {
    console.error("Error generating health tips:", error);
    throw new Error("Failed to generate personalized health tips");
  }
}

/**
 * Get quick health tips for common conditions
 */
export function getQuickHealthTips(conditions: string[]): HealthTip[] {
  const tipDatabase: Record<string, HealthTip> = {
    obesity: {
      id: "tip-obesity",
      title: "Weight Management",
      titleAr: "إدارة الوزن",
      description: "Your pet may be overweight. Increase exercise and adjust diet portions.",
      descriptionAr: "قد يكون حيوانك الأليف زائد الوزن. زيادة التمارين وتعديل حصص الطعام.",
      category: "nutrition",
      priority: "high",
      actionItems: ["Increase daily walks", "Reduce treat portions", "Use low-calorie treats"],
      actionItemsAr: ["زيادة المشي اليومي", "تقليل حصص الوجبات الخفيفة", "استخدام وجبات خفيفة منخفضة السعرات"],
      estimatedBenefit: "Improved mobility and reduced health risks",
      estimatedBenefitAr: "تحسين الحركة وتقليل المخاطر الصحية",
      relatedConditions: ["obesity", "diabetes", "joint_pain"],
      urgency: "soon",
      emoji: "⚖️",
    },
    anxiety: {
      id: "tip-anxiety",
      title: "Stress Management",
      titleAr: "إدارة التوتر",
      description: "Your pet shows signs of anxiety. Create a safe space and use calming techniques.",
      descriptionAr: "يظهر حيوانك الأليف علامات القلق. أنشئ مساحة آمنة واستخدم تقنيات الهدوء.",
      category: "behavior",
      priority: "medium",
      actionItems: ["Create a quiet space", "Use calming music", "Practice relaxation exercises"],
      actionItemsAr: ["إنشاء مساحة هادئة", "استخدام موسيقى مهدئة", "ممارسة تمارين الاسترخاء"],
      estimatedBenefit: "Reduced stress and improved behavior",
      estimatedBenefitAr: "تقليل التوتر وتحسين السلوك",
      relatedConditions: ["anxiety", "stress", "behavioral_issues"],
      urgency: "soon",
      emoji: "🧘",
    },
    dental_disease: {
      id: "tip-dental",
      title: "Dental Care",
      titleAr: "العناية بالأسنان",
      description: "Your pet needs improved dental care. Brush teeth regularly and use dental treats.",
      descriptionAr: "يحتاج حيوانك الأليف إلى رعاية أسنان محسنة. نظف الأسنان بانتظام واستخدم علاجات الأسنان.",
      category: "preventive",
      priority: "high",
      actionItems: ["Brush teeth daily", "Use dental treats", "Schedule professional cleaning"],
      actionItemsAr: ["تنظيف الأسنان يومياً", "استخدام علاجات الأسنان", "جدولة التنظيف المهني"],
      estimatedBenefit: "Better oral health and fresh breath",
      estimatedBenefitAr: "صحة فم أفضل ونفس منعش",
      relatedConditions: ["dental_disease", "tartar", "gingivitis"],
      urgency: "soon",
      emoji: "🦷",
    },
    low_activity: {
      id: "tip-exercise",
      title: "Increase Exercise",
      titleAr: "زيادة التمارين",
      description: "Your pet needs more physical activity. Increase playtime and outdoor activities.",
      descriptionAr: "يحتاج حيوانك الأليف إلى نشاط بدني أكثر. زيادة وقت اللعب والأنشطة الخارجية.",
      category: "exercise",
      priority: "medium",
      actionItems: ["Daily walks", "Interactive play", "Outdoor adventures"],
      actionItemsAr: ["مشي يومي", "لعب تفاعلي", "مغامرات خارجية"],
      estimatedBenefit: "Improved fitness and mental health",
      estimatedBenefitAr: "تحسين اللياقة والصحة العقلية",
      relatedConditions: ["low_activity", "obesity", "depression"],
      urgency: "soon",
      emoji: "🏃",
    },
    poor_nutrition: {
      id: "tip-nutrition",
      title: "Nutrition Improvement",
      titleAr: "تحسين التغذية",
      description: "Your pet's diet needs improvement. Consult vet for balanced nutrition plan.",
      descriptionAr: "يحتاج نظام غذائي حيوانك الأليف إلى تحسين. استشر الطبيب البيطري للحصول على خطة تغذية متوازنة.",
      category: "nutrition",
      priority: "high",
      actionItems: ["Consult veterinarian", "Switch to premium food", "Add supplements if needed"],
      actionItemsAr: ["استشر الطبيب البيطري", "الانتقال إلى طعام فاخر", "إضافة المكملات إذا لزم الأمر"],
      estimatedBenefit: "Better health and energy levels",
      estimatedBenefitAr: "صحة أفضل ومستويات طاقة أعلى",
      relatedConditions: ["poor_nutrition", "malnutrition", "digestive_issues"],
      urgency: "soon",
      emoji: "🥗",
    },
  };

  return conditions
    .map((condition) => tipDatabase[condition.toLowerCase()])
    .filter((tip) => tip !== undefined);
}

/**
 * Get wellness tips based on pet age
 */
export function getAgeBasedWellnessTips(age: number, species: string): HealthTip[] {
  const tips: HealthTip[] = [];

  if (age < 1) {
    tips.push({
      id: "tip-puppy-care",
      title: "Puppy Care Essentials",
      titleAr: "أساسيات رعاية الجرو",
      description: "Your young pet needs proper socialization, training, and vaccination.",
      descriptionAr: "يحتاج حيوانك الأليف الصغير إلى التنشئة الاجتماعية والتدريب والتطعيم المناسب.",
      category: "preventive",
      priority: "high",
      actionItems: ["Complete vaccinations", "Socialization training", "Regular vet checkups"],
      actionItemsAr: ["إكمال التطعيمات", "تدريب التنشئة الاجتماعية", "فحوصات بيطرية منتظمة"],
      estimatedBenefit: "Healthy development and strong immune system",
      estimatedBenefitAr: "نمو صحي وجهاز مناعة قوي",
      relatedConditions: ["young_age", "development"],
      urgency: "urgent",
      emoji: "👶",
    });
  } else if (age >= 7) {
    tips.push({
      id: "tip-senior-care",
      title: "Senior Pet Care",
      titleAr: "رعاية الحيوان الأليف المسن",
      description: "Your senior pet needs regular health monitoring and adjusted care.",
      descriptionAr: "يحتاج حيوانك الأليف المسن إلى مراقبة صحية منتظمة ورعاية معدلة.",
      category: "preventive",
      priority: "high",
      actionItems: ["Bi-annual vet visits", "Joint supplements", "Comfortable bedding"],
      actionItemsAr: ["زيارات بيطرية نصف سنوية", "مكملات المفاصل", "فراش مريح"],
      estimatedBenefit: "Extended lifespan and quality of life",
      estimatedBenefitAr: "عمر أطول وجودة حياة أفضل",
      relatedConditions: ["senior_age", "arthritis", "cognitive_decline"],
      urgency: "soon",
      emoji: "👴",
    });
  }

  return tips;
}

/**
 * Get seasonal health tips
 */
export function getSeasonalHealthTips(season: "spring" | "summer" | "fall" | "winter"): HealthTip[] {
  const seasonalTips: Record<string, HealthTip[]> = {
    spring: [
      {
        id: "tip-spring-allergies",
        title: "Allergy Management",
        titleAr: "إدارة الحساسية",
        description: "Spring allergies are common. Monitor for itching and consult vet if needed.",
        descriptionAr: "حساسيات الربيع شائعة. راقب الحكة واستشر الطبيب البيطري إذا لزم الأمر.",
        category: "wellness",
        priority: "medium",
        actionItems: ["Monitor for symptoms", "Regular baths", "Consult vet if needed"],
        actionItemsAr: ["مراقبة الأعراض", "حمامات منتظمة", "استشر الطبيب البيطري إذا لزم الأمر"],
        estimatedBenefit: "Reduced allergy symptoms",
        estimatedBenefitAr: "تقليل أعراض الحساسية",
        relatedConditions: ["allergies", "itching"],
        urgency: "routine",
        emoji: "🌸",
      },
    ],
    summer: [
      {
        id: "tip-summer-heat",
        title: "Heat Safety",
        titleAr: "سلامة الحرارة",
        description: "Keep your pet cool and hydrated. Avoid hot pavement and provide shade.",
        descriptionAr: "حافظ على برودة حيوانك الأليف وترطيبه. تجنب الرصيف الساخن وفر الظل.",
        category: "wellness",
        priority: "high",
        actionItems: ["Provide fresh water", "Limit outdoor time", "Use cooling mats"],
        actionItemsAr: ["توفير ماء عذب", "تحديد وقت خارجي", "استخدام حصائر التبريد"],
        estimatedBenefit: "Prevention of heat stroke",
        estimatedBenefitAr: "الوقاية من ضربة الشمس",
        relatedConditions: ["heat_stress", "dehydration"],
        urgency: "urgent",
        emoji: "☀️",
      },
    ],
    fall: [
      {
        id: "tip-fall-parasites",
        title: "Parasite Prevention",
        titleAr: "الوقاية من الطفيليات",
        description: "Fall is parasite season. Ensure flea and tick prevention is current.",
        descriptionAr: "الخريف هو موسم الطفيليات. تأكد من أن الوقاية من البراغيث والقراد حالية.",
        category: "preventive",
        priority: "high",
        actionItems: ["Apply flea/tick treatment", "Check for parasites", "Regular grooming"],
        actionItemsAr: ["تطبيق علاج البراغيث/القراد", "فحص الطفيليات", "العناية المنتظمة"],
        estimatedBenefit: "Protection from parasites",
        estimatedBenefitAr: "الحماية من الطفيليات",
        relatedConditions: ["fleas", "ticks", "parasites"],
        urgency: "soon",
        emoji: "🍂",
      },
    ],
    winter: [
      {
        id: "tip-winter-cold",
        title: "Cold Weather Care",
        titleAr: "رعاية الطقس البارد",
        description: "Winter requires extra care. Protect paws and limit cold exposure.",
        descriptionAr: "يتطلب الشتاء عناية إضافية. حماية المخالب وتحديد التعرض للبرد.",
        category: "wellness",
        priority: "medium",
        actionItems: ["Use paw protection", "Limit outdoor time", "Provide warm shelter"],
        actionItemsAr: ["استخدام حماية المخالب", "تحديد وقت خارجي", "توفير مأوى دافئ"],
        estimatedBenefit: "Prevention of cold-related injuries",
        estimatedBenefitAr: "الوقاية من الإصابات المرتبطة بالبرد",
        relatedConditions: ["cold_exposure", "frostbite"],
        urgency: "routine",
        emoji: "❄️",
      },
    ],
  };

  return seasonalTips[season] || [];
}
