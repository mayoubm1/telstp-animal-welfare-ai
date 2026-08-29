/**
 * Diseases Database Seeding Script
 * Populates database with comprehensive disease catalog
 */

import { db } from "../server/db";
import { diseases } from "../drizzle/schema";

const diseasesData = [
  // Common Infectious Diseases
  {
    name: "Parvovirus (Parvo)",
    nameAr: "فيروس الباروفيروس",
    category: "infectious",
    categoryAr: "معدية",
    severity: "severe",
    affectedSpecies: ["dog", "cat"],
    symptoms: ["Vomiting", "Diarrhea", "Lethargy", "Fever"],
    symptomsAr: ["القيء", "الإسهال", "الخمول", "الحمى"],
    description: "Highly contagious viral disease affecting intestines",
    descriptionAr: "مرض فيروسي معدي جداً يؤثر على الأمعاء",
    treatment: "Supportive care, IV fluids, antibiotics",
    treatmentAr: "الرعاية الداعمة، السوائل الوريدية، المضادات الحيوية",
    prevention: "Vaccination, hygiene",
    preventionAr: "التطعيم، النظافة",
    transmissionMethod: "Contact with infected feces",
    transmissionMethodAr: "الاتصال بالبراز المصاب",
    incubationPeriod: 3,
    contagiousPeriod: 14,
    mortality: 30,
  },
  {
    name: "Distemper",
    nameAr: "التهاب الدماغ والنخاع",
    category: "infectious",
    categoryAr: "معدية",
    severity: "severe",
    affectedSpecies: ["dog"],
    symptoms: ["Fever", "Cough", "Nasal discharge", "Neurological signs"],
    symptomsAr: ["الحمى", "السعال", "إفرازات أنفية", "علامات عصبية"],
    description: "Viral disease affecting respiratory and nervous systems",
    descriptionAr: "مرض فيروسي يؤثر على الجهاز التنفسي والعصبي",
    treatment: "Supportive care, anticonvulsants if needed",
    treatmentAr: "الرعاية الداعمة، مضادات الاختلاج إذا لزم الأمر",
    prevention: "Vaccination",
    preventionAr: "التطعيم",
    transmissionMethod: "Airborne, contact with bodily fluids",
    transmissionMethodAr: "عن طريق الهواء، الاتصال بسوائل الجسم",
    incubationPeriod: 7,
    contagiousPeriod: 21,
    mortality: 50,
  },
  {
    name: "Feline Leukemia Virus (FeLV)",
    nameAr: "فيروس سرطان الدم في القطط",
    category: "infectious",
    categoryAr: "معدية",
    severity: "severe",
    affectedSpecies: ["cat"],
    symptoms: ["Anemia", "Lethargy", "Loss of appetite", "Fever"],
    symptomsAr: ["فقر الدم", "الخمول", "فقدان الشهية", "الحمى"],
    description: "Retrovirus affecting immune system in cats",
    descriptionAr: "فيروس يؤثر على جهاز المناعة في القطط",
    treatment: "Supportive care, antiretroviral drugs",
    treatmentAr: "الرعاية الداعمة، الأدوية المضادة للفيروسات",
    prevention: "Vaccination, indoor housing",
    preventionAr: "التطعيم، الإسكان الداخلي",
    transmissionMethod: "Saliva, blood, urine",
    transmissionMethodAr: "اللعاب، الدم، البول",
    incubationPeriod: 14,
    contagiousPeriod: 365,
    mortality: 85,
  },
  // Parasitic Diseases
  {
    name: "Heartworm Disease",
    nameAr: "مرض الديدان القلبية",
    category: "parasitic",
    categoryAr: "寄生虫",
    severity: "severe",
    affectedSpecies: ["dog", "cat"],
    symptoms: ["Cough", "Fatigue", "Difficulty breathing", "Lethargy"],
    symptomsAr: ["السعال", "الإرهاق", "صعوبة التنفس", "الخمول"],
    description: "Parasitic disease transmitted by mosquitoes",
    descriptionAr: "مرض طفيلي ينتقل عن طريق البعوض",
    treatment: "Heartworm medication, rest",
    treatmentAr: "أدوية الديدان القلبية، الراحة",
    prevention: "Monthly preventive medication",
    preventionAr: "الأدوية الوقائية الشهرية",
    transmissionMethod: "Mosquito bite",
    transmissionMethodAr: "لدغة البعوض",
    incubationPeriod: 180,
    contagiousPeriod: 365,
    mortality: 10,
  },
  {
    name: "Fleas",
    nameAr: "البراغيث",
    category: "parasitic",
    categoryAr: "寄生虫",
    severity: "mild",
    affectedSpecies: ["dog", "cat"],
    symptoms: ["Itching", "Hair loss", "Red skin", "Flea dirt"],
    symptomsAr: ["الحكة", "تساقط الشعر", "احمرار الجلد", "براز البراغيث"],
    description: "External parasites causing itching and discomfort",
    descriptionAr: "طفيليات خارجية تسبب الحكة والانزعاج",
    treatment: "Flea treatments, environmental control",
    treatmentAr: "علاجات البراغيث، التحكم البيئي",
    prevention: "Monthly flea prevention",
    preventionAr: "الوقاية من البراغيث الشهرية",
    transmissionMethod: "Contact with infested animals",
    transmissionMethodAr: "الاتصال بالحيوانات المصابة",
    incubationPeriod: 7,
    contagiousPeriod: 365,
    mortality: 0,
  },
  // Genetic/Congenital Diseases
  {
    name: "Hip Dysplasia",
    nameAr: "خلل التنسج الورك",
    category: "genetic",
    categoryAr: "وراثية",
    severity: "moderate",
    affectedSpecies: ["dog"],
    symptoms: ["Limping", "Difficulty rising", "Reduced activity", "Pain"],
    symptomsAr: ["العرج", "صعوبة النهوض", "تقليل النشاط", "الألم"],
    description: "Genetic disorder affecting hip joint development",
    descriptionAr: "اضطراب وراثي يؤثر على تطور مفصل الورك",
    treatment: "Physical therapy, pain management, surgery",
    treatmentAr: "العلاج الطبيعي، إدارة الألم، الجراحة",
    prevention: "Selective breeding, weight management",
    preventionAr: "التكاثر الانتقائي، إدارة الوزن",
    transmissionMethod: "Genetic inheritance",
    transmissionMethodAr: "الوراثة الجينية",
    incubationPeriod: 0,
    contagiousPeriod: 0,
    mortality: 0,
  },
  // Metabolic Diseases
  {
    name: "Diabetes Mellitus",
    nameAr: "داء السكري",
    category: "metabolic",
    categoryAr: "أيضية",
    severity: "moderate",
    affectedSpecies: ["dog", "cat"],
    symptoms: ["Increased thirst", "Frequent urination", "Weight loss", "Lethargy"],
    symptomsAr: ["زيادة العطش", "التبول المتكرر", "فقدان الوزن", "الخمول"],
    description: "Disorder of blood glucose regulation",
    descriptionAr: "اضطراب تنظيم الجلوكوز في الدم",
    treatment: "Insulin therapy, dietary management",
    treatmentAr: "العلاج بالأنسولين، إدارة النظام الغذائي",
    prevention: "Weight management, healthy diet",
    preventionAr: "إدارة الوزن، نظام غذائي صحي",
    transmissionMethod: "Non-contagious",
    transmissionMethodAr: "غير معدية",
    incubationPeriod: 0,
    contagiousPeriod: 0,
    mortality: 5,
  },
  // Allergic Diseases
  {
    name: "Allergic Dermatitis",
    nameAr: "التهاب الجلد التحسسي",
    category: "allergic",
    categoryAr: "تحسسية",
    severity: "mild",
    affectedSpecies: ["dog", "cat"],
    symptoms: ["Itching", "Red skin", "Hair loss", "Scratching"],
    symptomsAr: ["الحكة", "احمرار الجلد", "تساقط الشعر", "الخدش"],
    description: "Allergic reaction affecting skin",
    descriptionAr: "رد فعل تحسسي يؤثر على الجلد",
    treatment: "Antihistamines, corticosteroids, allergen avoidance",
    treatmentAr: "مضادات الهيستامين، الكورتيكوستيرويدات، تجنب مسببات الحساسية",
    prevention: "Identify and avoid allergens",
    preventionAr: "تحديد وتجنب مسببات الحساسية",
    transmissionMethod: "Non-contagious",
    transmissionMethodAr: "غير معدية",
    incubationPeriod: 0,
    contagiousPeriod: 0,
    mortality: 0,
  },
];

export async function seedDiseases() {
  try {
    console.log("🌱 Seeding diseases database...");

    for (const disease of diseasesData) {
      await db.insert(diseases).values({
        ...disease,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`✅ Successfully seeded ${diseasesData.length} diseases`);
  } catch (error) {
    console.error("❌ Error seeding diseases:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDiseases()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
