/**
 * Veterinary Knowledge Base
 * Comprehensive pet care guidelines based on AAFCO, FEDIAF, and veterinary best practices
 */

export const veterinaryKB = {
  nutrition: {
    puppies: {
      titleAr: "تغذية الجراء",
      titleEn: "Puppy Nutrition",
      descriptionAr: "معايير AAFCO للجراء - نمو صحي وتطور سليم",
      descriptionEn: "AAFCO standards for puppies - healthy growth and development",
      recommendations: [
        {
          nameAr: "البروتين",
          nameEn: "Protein",
          minPercentage: 22,
          descriptionAr: "ضروري لبناء العضلات والأنسجة",
          descriptionEn: "Essential for muscle and tissue development",
        },
        {
          nameAr: "الدهون",
          nameEn: "Fat",
          minPercentage: 8,
          descriptionAr: "مصدر الطاقة والأحماض الدهنية الأساسية",
          descriptionEn: "Energy source and essential fatty acids",
        },
        {
          nameAr: "الكالسيوم والفوسفور",
          nameEn: "Calcium & Phosphorus",
          ratio: "1.2:1",
          descriptionAr: "لتطور العظام والأسنان",
          descriptionEn: "For bone and teeth development",
        },
      ],
      products: ["premium-dog-food"],
    },
    adults: {
      titleAr: "تغذية الكلاب البالغة",
      titleEn: "Adult Dog Nutrition",
      descriptionAr: "معايير AAFCO للكلاب البالغة - الصحة المثالية",
      descriptionEn: "AAFCO standards for adult dogs - optimal health",
      recommendations: [
        {
          nameAr: "البروتين",
          nameEn: "Protein",
          minPercentage: 18,
          descriptionAr: "الحفاظ على كتلة العضلات",
          descriptionEn: "Maintain muscle mass",
        },
        {
          nameAr: "الدهون",
          nameEn: "Fat",
          minPercentage: 5,
          descriptionAr: "الطاقة والصحة الجلدية",
          descriptionEn: "Energy and skin health",
        },
      ],
      products: ["premium-dog-food"],
    },
    seniors: {
      titleAr: "تغذية الكلاب المسنة",
      titleEn: "Senior Dog Nutrition",
      descriptionAr: "تغذية خاصة للكلاب فوق 7 سنوات",
      descriptionEn: "Special nutrition for dogs over 7 years",
      recommendations: [
        {
          nameAr: "البروتين",
          nameEn: "Protein",
          minPercentage: 18,
          descriptionAr: "الحفاظ على كتلة العضلات مع التقدم في العمر",
          descriptionEn: "Maintain muscle mass with age",
        },
        {
          nameAr: "الدهون",
          nameEn: "Fat",
          minPercentage: 5,
          descriptionAr: "سهلة الهضم",
          descriptionEn: "Easy to digest",
        },
        {
          nameAr: "الألياف",
          nameEn: "Fiber",
          descriptionAr: "تحسين الهضم",
          descriptionEn: "Improve digestion",
        },
      ],
      products: ["premium-dog-food"],
    },
  },
  training: {
    basicObedience: {
      titleAr: "تدريب الطاعة الأساسي",
      titleEn: "Basic Obedience Training",
      durationWeeks: 4,
      frequencyPerWeek: 3,
      sessionDurationMinutes: 15,
      commands: ["sit", "stay", "come", "heel"],
      products: ["training-leash"],
      tips: [
        {
          tipAr: "استخدم المكافآت الإيجابية",
          tipEn: "Use positive rewards",
        },
        {
          tipAr: "جلسات قصيرة ومركزة",
          tipEn: "Short focused sessions",
        },
        {
          tipAr: "الاستمرارية والصبر",
          tipEn: "Consistency and patience",
        },
      ],
    },
    advancedTricks: {
      titleAr: "الحيل المتقدمة",
      titleEn: "Advanced Tricks",
      durationWeeks: 6,
      frequencyPerWeek: 3,
      sessionDurationMinutes: 20,
      commands: ["spin", "play-dead", "jump", "crawl"],
      products: ["training-leash"],
      prerequisites: ["basic-obedience"],
    },
    agility: {
      titleAr: "تدريب الرشاقة",
      titleEn: "Agility Training",
      durationWeeks: 8,
      frequencyPerWeek: 3,
      sessionDurationMinutes: 30,
      products: ["training-leash"],
      prerequisites: ["basic-obedience"],
    },
  },
  health: {
    preventiveCare: {
      titleAr: "الرعاية الوقائية",
      titleEn: "Preventive Care",
      recommendations: [
        {
          titleAr: "التطعيمات",
          titleEn: "Vaccinations",
          scheduleAr: "سنويًا",
          scheduleEn: "Annually",
          descriptionAr: "الحماية من الأمراض المعدية",
          descriptionEn: "Protection from infectious diseases",
        },
        {
          titleAr: "الفحص البيطري",
          titleEn: "Veterinary Checkup",
          scheduleAr: "سنويًا (مرتين للمسنين)",
          scheduleEn: "Annually (twice for seniors)",
          descriptionAr: "الكشف المبكر عن المشاكل الصحية",
          descriptionEn: "Early detection of health issues",
        },
        {
          titleAr: "تنظيف الأسنان",
          titleEn: "Dental Cleaning",
          scheduleAr: "سنويًا",
          scheduleEn: "Annually",
          descriptionAr: "منع أمراض اللثة",
          descriptionEn: "Prevent gum disease",
        },
        {
          titleAr: "مكافحة الطفيليات",
          titleEn: "Parasite Control",
          scheduleAr: "شهريًا",
          scheduleEn: "Monthly",
          descriptionAr: "الحماية من البراغيث والديدان",
          descriptionEn: "Protection from fleas and worms",
        },
      ],
    },
    commonConditions: {
      allergies: {
        titleAr: "الحساسية",
        titleEn: "Allergies",
        signsAr: ["حكة مستمرة", "احمرار الجلد", "تساقط الشعر"],
        signsEn: ["Constant itching", "Red skin", "Hair loss"],
        managementAr: "تحديد المسبب، تغيير الغذاء، أدوية مضادة للحساسية",
        managementEn: "Identify trigger, change diet, antihistamines",
      },
      arthritis: {
        titleAr: "التهاب المفاصل",
        titleEn: "Arthritis",
        signsAr: ["صعوبة الحركة", "العرج", "تورم المفاصل"],
        signsEn: ["Difficulty moving", "Limping", "Joint swelling"],
        managementAr: "تمارين خفيفة، أدوية، مكملات غذائية",
        managementEn: "Light exercise, medications, supplements",
      },
      diabetes: {
        titleAr: "السكري",
        titleEn: "Diabetes",
        signsAr: ["العطش الزائد", "كثرة التبول", "فقدان الوزن"],
        signsEn: ["Excessive thirst", "Frequent urination", "Weight loss"],
        managementAr: "حمية خاصة، أنسولين، مراقبة منتظمة",
        managementEn: "Special diet, insulin, regular monitoring",
      },
    },
  },
  behavior: {
    anxiety: {
      titleAr: "القلق والخوف",
      titleEn: "Anxiety and Fear",
      causesAr: ["الانفصال", "الضوضاء العالية", "التغييرات البيئية"],
      causesEn: ["Separation", "Loud noises", "Environmental changes"],
      solutionsAr: [
        "التعريض التدريجي",
        "تدريب التهدئة",
        "استشارة متخصص السلوك",
      ],
      solutionsEn: [
        "Gradual exposure",
        "Calming training",
        "Consult behavior specialist",
      ],
    },
    aggression: {
      titleAr: "العدوانية",
      titleEn: "Aggression",
      causesAr: ["الخوف", "الحماية", "عدم التنشئة الاجتماعية"],
      causesEn: ["Fear", "Protection", "Lack of socialization"],
      solutionsAr: [
        "التدريب الاحترافي",
        "إعادة التنشئة الاجتماعية",
        "استشارة بيطرية",
      ],
      solutionsEn: [
        "Professional training",
        "Resocialization",
        "Veterinary consultation",
      ],
    },
  },
};

export type VeterinaryKB = typeof veterinaryKB;
