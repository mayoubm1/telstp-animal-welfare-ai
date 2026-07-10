import { invokeLLM } from "../_core/llm";

export interface SoundHealthMapping {
  soundType: string;
  soundTypeAr: string;
  petSpecies: "dog" | "cat";
  healthConditions: HealthCondition[];
  urgencyLevel: "routine" | "urgent" | "emergency";
  recommendedActions: string[];
  recommendedActionsAr: string[];
  vetConsultationNeeded: boolean;
}

export interface HealthCondition {
  name: string;
  nameAr: string;
  likelihood: number;
  symptoms: string[];
  symptomsAr: string[];
  treatmentOptions: string[];
  treatmentOptionsAr: string[];
  preventionTips: string[];
  preventionTipsAr: string[];
}

const SOUND_HEALTH_DATABASE = {
  dog: {
    "reverse_sneeze": {
      name: "Reverse Sneeze",
      nameAr: "العطس المعكوس",
      conditions: [
        {
          name: "Nasal Irritation",
          nameAr: "تهيج الأنف",
          likelihood: 0.7,
          severity: "low",
        },
        {
          name: "Allergies",
          nameAr: "الحساسية",
          likelihood: 0.5,
          severity: "low",
        },
        {
          name: "Foreign Object",
          nameAr: "جسم غريب",
          likelihood: 0.2,
          severity: "medium",
        },
      ],
      urgency: "routine",
    },
    "excessive_panting": {
      name: "Excessive Panting",
      nameAr: "اللهاث المفرط",
      conditions: [
        {
          name: "Heat Stress",
          nameAr: "إجهاد حراري",
          likelihood: 0.6,
          severity: "medium",
        },
        {
          name: "Anxiety",
          nameAr: "القلق",
          likelihood: 0.4,
          severity: "low",
        },
        {
          name: "Heart Disease",
          nameAr: "أمراض القلب",
          likelihood: 0.3,
          severity: "high",
        },
        {
          name: "Pain",
          nameAr: "الألم",
          likelihood: 0.25,
          severity: "medium",
        },
      ],
      urgency: "urgent",
    },
    "coughing": {
      name: "Coughing",
      nameAr: "السعال",
      conditions: [
        {
          name: "Kennel Cough",
          nameAr: "السعال الكنيلي",
          likelihood: 0.5,
          severity: "low",
        },
        {
          name: "Heartworm",
          nameAr: "الديدان القلبية",
          likelihood: 0.3,
          severity: "high",
        },
        {
          name: "Pneumonia",
          nameAr: "الالتهاب الرئوي",
          likelihood: 0.2,
          severity: "high",
        },
        {
          name: "Allergies",
          nameAr: "الحساسية",
          likelihood: 0.4,
          severity: "low",
        },
      ],
      urgency: "urgent",
    },
    "whimpering": {
      name: "Whimpering",
      nameAr: "الأنين",
      conditions: [
        {
          name: "Pain",
          nameAr: "الألم",
          likelihood: 0.8,
          severity: "high",
        },
        {
          name: "Anxiety",
          nameAr: "القلق",
          likelihood: 0.5,
          severity: "low",
        },
        {
          name: "Illness",
          nameAr: "المرض",
          likelihood: 0.4,
          severity: "medium",
        },
      ],
      urgency: "urgent",
    },
  },
  cat: {
    "excessive_meowing": {
      name: "Excessive Meowing",
      nameAr: "المواء المفرط",
      conditions: [
        {
          name: "Heat Cycle",
          nameAr: "دورة الشبق",
          likelihood: 0.7,
          severity: "low",
        },
        {
          name: "Hyperthyroidism",
          nameAr: "فرط نشاط الغدة الدرقية",
          likelihood: 0.4,
          severity: "medium",
        },
        {
          name: "Cognitive Dysfunction",
          nameAr: "خلل وظيفي إدراكي",
          likelihood: 0.2,
          severity: "low",
        },
        {
          name: "Attention Seeking",
          nameAr: "البحث عن الانتباه",
          likelihood: 0.6,
          severity: "low",
        },
      ],
      urgency: "routine",
    },
    "hissing": {
      name: "Hissing",
      nameAr: "الهسهسة",
      conditions: [
        {
          name: "Fear/Defensive",
          nameAr: "الخوف/الدفاع",
          likelihood: 0.9,
          severity: "low",
        },
        {
          name: "Territorial Behavior",
          nameAr: "السلوك الإقليمي",
          likelihood: 0.7,
          severity: "low",
        },
      ],
      urgency: "routine",
    },
    "yowling": {
      name: "Yowling",
      nameAr: "العويل",
      conditions: [
        {
          name: "Heat Cycle",
          nameAr: "دورة الشبق",
          likelihood: 0.8,
          severity: "low",
        },
        {
          name: "Cognitive Dysfunction",
          nameAr: "خلل وظيفي إدراكي",
          likelihood: 0.3,
          severity: "medium",
        },
        {
          name: "Hyperthyroidism",
          nameAr: "فرط نشاط الغدة الدرقية",
          likelihood: 0.3,
          severity: "medium",
        },
      ],
      urgency: "routine",
    },
    "chattering": {
      name: "Chattering",
      nameAr: "الثرثرة",
      conditions: [
        {
          name: "Hunting Instinct",
          nameAr: "غريزة الصيد",
          likelihood: 0.9,
          severity: "low",
        },
        {
          name: "Frustration",
          nameAr: "الإحباط",
          likelihood: 0.5,
          severity: "low",
        },
      ],
      urgency: "routine",
    },
  },
};

export async function mapSoundToHealth(
  soundType: string,
  petSpecies: "dog" | "cat"
): Promise<SoundHealthMapping> {
  try {
    const speciesDatabase = SOUND_HEALTH_DATABASE[petSpecies] as Record<string, any>;
    const soundData = speciesDatabase[soundType];

    if (!soundData) {
      throw new Error(`Unknown sound type: ${soundType}`);
    }

    const healthConditions: HealthCondition[] = soundData.conditions.map((condition: any) => ({
      name: condition.name,
      nameAr: condition.nameAr,
      likelihood: condition.likelihood,
      symptoms: getSymptoms(condition.name),
      symptomsAr: getSymptomsAr(condition.name),
      treatmentOptions: getTreatmentOptions(condition.name),
      treatmentOptionsAr: getTreatmentOptionsAr(condition.name),
      preventionTips: getPreventionTips(condition.name),
      preventionTipsAr: getPreventionTipsAr(condition.name),
    }));

    const urgencyMap: Record<string, "routine" | "urgent" | "emergency"> = {
      routine: "routine",
      urgent: "urgent",
      emergency: "emergency",
    };

    const recommendedActions = getRecommendedActions(soundData.urgency as string, petSpecies, soundType);

    return {
      soundType: soundData.name,
      soundTypeAr: soundData.nameAr,
      petSpecies,
      healthConditions: healthConditions.sort((a, b) => b.likelihood - a.likelihood),
      urgencyLevel: (urgencyMap[soundData.urgency as keyof typeof urgencyMap] ||
        "routine") as "routine" | "urgent" | "emergency",
      recommendedActions,
      recommendedActionsAr: recommendedActions.map((action) => translateToArabic(action)),
      vetConsultationNeeded: soundData.urgency !== "routine",
    };
  } catch (error) {
    console.error("Error mapping sound to health:", error);
    throw error;
  }
}

function getSymptoms(condition: string): string[] {
  const symptomsMap: Record<string, string[]> = {
    "Nasal Irritation": ["Sneezing", "Nasal discharge", "Reverse sneezing"],
    Allergies: ["Itching", "Sneezing", "Watery eyes", "Nasal discharge"],
    "Foreign Object": ["Sneezing", "Nasal discharge", "Pawing at nose"],
    "Heat Stress": ["Excessive panting", "Lethargy", "Drooling", "Weakness"],
    Anxiety: ["Panting", "Trembling", "Pacing", "Restlessness"],
    "Heart Disease": ["Coughing", "Lethargy", "Difficulty breathing", "Fainting"],
    "Kennel Cough": ["Dry cough", "Gagging", "Lethargy", "Loss of appetite"],
    Heartworm: ["Coughing", "Lethargy", "Difficulty breathing", "Fainting"],
    Pneumonia: ["Coughing", "Fever", "Difficulty breathing", "Lethargy"],
    Pain: ["Whimpering", "Limping", "Reluctance to move", "Aggression"],
    Illness: ["Whimpering", "Lethargy", "Loss of appetite", "Fever"],
    "Heat Cycle": ["Excessive meowing", "Restlessness", "Marking territory"],
    Hyperthyroidism: ["Weight loss", "Increased appetite", "Hyperactivity", "Excessive meowing"],
    "Cognitive Dysfunction": ["Disorientation", "Excessive vocalization", "Sleep disturbances"],
    "Attention Seeking": ["Excessive meowing", "Following owner", "Demanding behavior"],
    "Fear/Defensive": ["Hissing", "Arched back", "Dilated pupils"],
    "Territorial Behavior": ["Hissing", "Marking territory", "Aggression"],
    "Hunting Instinct": ["Chattering", "Stalking behavior", "Pouncing"],
    Frustration: ["Chattering", "Tail swishing", "Agitation"],
  };

  return symptomsMap[condition] || [];
}

function getSymptomsAr(condition: string): string[] {
  const symptomsMapAr: Record<string, string[]> = {
    "Nasal Irritation": ["العطس", "إفرازات أنفية", "العطس المعكوس"],
    Allergies: ["الحكة", "العطس", "عيون دامعة", "إفرازات أنفية"],
    "Foreign Object": ["العطس", "إفرازات أنفية", "الخدش على الأنف"],
    "Heat Stress": ["اللهاث المفرط", "الخمول", "سيلان اللعاب", "الضعف"],
    Anxiety: ["اللهاث", "الارتجاج", "المشي", "الأرق"],
    "Heart Disease": ["السعال", "الخمول", "صعوبة التنفس", "الإغماء"],
    "Kennel Cough": ["السعال الجاف", "الاختناق", "الخمول", "فقدان الشهية"],
    Heartworm: ["السعال", "الخمول", "صعوبة التنفس", "الإغماء"],
    Pneumonia: ["السعال", "الحمى", "صعوبة التنفس", "الخمول"],
    Pain: ["الأنين", "العرج", "عدم الرغبة في الحركة", "العدوانية"],
    Illness: ["الأنين", "الخمول", "فقدان الشهية", "الحمى"],
    "Heat Cycle": ["المواء المفرط", "الأرق", "وضع العلامات"],
    Hyperthyroidism: ["فقدان الوزن", "زيادة الشهية", "فرط النشاط", "المواء المفرط"],
    "Cognitive Dysfunction": ["الارتباك", "الإفراط في الكلام", "اضطرابات النوم"],
    "Attention Seeking": ["المواء المفرط", "متابعة المالك", "السلوك المطالب"],
    "Fear/Defensive": ["الهسهسة", "ظهر مقوس", "حدقات متسعة"],
    "Territorial Behavior": ["الهسهسة", "وضع العلامات", "العدوانية"],
    "Hunting Instinct": ["الثرثرة", "سلوك الكمين", "الانقضاض"],
    Frustration: ["الثرثرة", "تمايل الذيل", "الإثارة"],
  };

  return symptomsMapAr[condition] || [];
}

function getTreatmentOptions(condition: string): string[] {
  const treatmentMap: Record<string, string[]> = {
    "Nasal Irritation": ["Remove irritants", "Humidifier", "Saline nasal drops"],
    Allergies: ["Antihistamines", "Allergen avoidance", "Steroid nasal spray"],
    "Foreign Object": ["Veterinary removal", "Anesthesia may be needed"],
    "Heat Stress": ["Cool environment", "Water access", "Shade", "Veterinary care if severe"],
    Anxiety: ["Calming supplements", "Behavior modification", "Anxiety medication"],
    "Heart Disease": ["Cardiac medications", "Reduced exercise", "Dietary management"],
    "Kennel Cough": ["Rest", "Cough suppressants", "Antibiotics if needed"],
    Heartworm: ["Heartworm medication", "Rest", "Surgical removal if severe"],
    Pneumonia: ["Antibiotics", "Rest", "Oxygen therapy if needed"],
    Pain: ["Pain medication", "Rest", "Physical therapy", "Surgery if needed"],
    Illness: ["Supportive care", "Medication", "Veterinary treatment"],
    "Heat Cycle": ["Spaying", "Hormone therapy"],
    Hyperthyroidism: ["Thyroid medication", "Radioactive iodine", "Surgery"],
    "Cognitive Dysfunction": ["Medication", "Environmental enrichment", "Behavior modification"],
    "Attention Seeking": ["Behavior training", "Scheduled attention", "Environmental enrichment"],
    "Fear/Defensive": ["Behavior modification", "Desensitization", "Calming supplements"],
    "Territorial Behavior": ["Spaying/Neutering", "Behavior training", "Environmental management"],
    "Hunting Instinct": ["Environmental enrichment", "Toys", "Supervised outdoor time"],
    Frustration: ["Environmental enrichment", "Play sessions", "Behavior training"],
  };

  return treatmentMap[condition] || [];
}

function getTreatmentOptionsAr(condition: string): string[] {
  const treatmentMapAr: Record<string, string[]> = {
    "Nasal Irritation": ["إزالة المهيجات", "جهاز ترطيب", "قطرات أنف ملحية"],
    Allergies: ["مضادات الهيستامين", "تجنب مسببات الحساسية", "رذاذ الأنف الستيرويدي"],
    "Foreign Object": ["إزالة بيطرية", "قد تكون هناك حاجة للتخدير"],
    "Heat Stress": ["بيئة باردة", "الوصول للماء", "الظل", "الرعاية البيطرية إذا كانت شديدة"],
    Anxiety: ["مكملات مهدئة", "تعديل السلوك", "دواء القلق"],
    "Heart Disease": ["أدوية القلب", "تقليل التمرين", "إدارة النظام الغذائي"],
    "Kennel Cough": ["الراحة", "مثبطات السعال", "المضادات الحيوية إذا لزم الأمر"],
    Heartworm: ["دواء الديدان القلبية", "الراحة", "الإزالة الجراحية إذا كانت شديدة"],
    Pneumonia: ["المضادات الحيوية", "الراحة", "العلاج بالأكسجين إذا لزم الأمر"],
    Pain: ["دواء الألم", "الراحة", "العلاج الطبيعي", "الجراحة إذا لزم الأمر"],
    Illness: ["الرعاية الداعمة", "الأدوية", "العلاج البيطري"],
    "Heat Cycle": ["الإخصاء", "العلاج الهرموني"],
    Hyperthyroidism: ["دواء الغدة الدرقية", "اليود المشع", "الجراحة"],
    "Cognitive Dysfunction": ["الأدوية", "الإثراء البيئي", "تعديل السلوك"],
    "Attention Seeking": ["تدريب السلوك", "الانتباه المجدول", "الإثراء البيئي"],
    "Fear/Defensive": ["تعديل السلوك", "إزالة التحسس", "مكملات مهدئة"],
    "Territorial Behavior": ["الإخصاء", "تدريب السلوك", "إدارة البيئة"],
    "Hunting Instinct": ["الإثراء البيئي", "الألعاب", "الوقت الخارجي المراقب"],
    Frustration: ["الإثراء البيئي", "جلسات اللعب", "تدريب السلوك"],
  };

  return treatmentMapAr[condition] || [];
}

function getPreventionTips(condition: string): string[] {
  return [
    "Regular veterinary check-ups",
    "Maintain healthy diet",
    "Keep environment clean",
    "Provide exercise and enrichment",
    "Monitor for early signs",
  ];
}

function getPreventionTipsAr(condition: string): string[] {
  return [
    "الفحوصات البيطرية المنتظمة",
    "الحفاظ على نظام غذائي صحي",
    "الحفاظ على نظافة البيئة",
    "توفير التمرين والإثراء",
    "مراقبة العلامات المبكرة",
  ];
}

function getRecommendedActions(urgency: string, petSpecies: string, soundType: string): string[] {
  const actions: Record<string, string[]> = {
    routine: [
      "Monitor your pet closely",
      "Keep a log of vocalizations",
      "Schedule regular vet check-ups",
      "Provide environmental enrichment",
    ],
    urgent: [
      "Contact your veterinarian immediately",
      "Monitor vital signs (temperature, breathing rate)",
      "Provide comfortable resting area",
      "Avoid stressful situations",
      "Be prepared to describe symptoms to vet",
    ],
    emergency: [
      "SEEK EMERGENCY VETERINARY CARE IMMEDIATELY",
      "Monitor breathing and consciousness",
      "Keep pet calm and comfortable",
      "Transport to nearest emergency clinic",
      "Have medical history ready",
    ],
  };

  return actions[urgency] || actions["routine"];
}

function translateToArabic(text: string): string {
  const translations: Record<string, string> = {
    "Monitor your pet closely": "راقب حيوانك الأليف عن كثب",
    "Keep a log of vocalizations": "احتفظ بسجل للأصوات",
    "Schedule regular vet check-ups": "جدول الفحوصات البيطرية المنتظمة",
    "Provide environmental enrichment": "توفير الإثراء البيئي",
    "Contact your veterinarian immediately": "اتصل بطبيبك البيطري على الفور",
    "Monitor vital signs (temperature, breathing rate)": "مراقبة العلامات الحيوية (درجة الحرارة، معدل التنفس)",
    "Provide comfortable resting area": "توفير منطقة راحة مريحة",
    "Avoid stressful situations": "تجنب المواقف المجهدة",
    "Be prepared to describe symptoms to vet": "كن مستعداً لوصف الأعراض للطبيب البيطري",
    "SEEK EMERGENCY VETERINARY CARE IMMEDIATELY": "اطلب الرعاية البيطرية الطارئة على الفور",
    "Monitor breathing and consciousness": "مراقبة التنفس والوعي",
    "Keep pet calm and comfortable": "حافظ على هدوء حيوانك الأليف وراحته",
    "Transport to nearest emergency clinic": "نقل إلى أقرب عيادة طوارئ",
    "Have medical history ready": "جهز السجل الطبي",
  };

  return translations[text] || text;
}
