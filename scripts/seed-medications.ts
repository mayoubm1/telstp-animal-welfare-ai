/**
 * Medications Database Seeding Script
 * Populates database with comprehensive medication protocols
 */

import { db } from "../server/db";
import { medications } from "../drizzle/schema";

const medicationsData = [
  // Antibiotics
  {
    name: "Amoxicillin",
    nameAr: "أموكسيسيلين",
    category: "antibiotic",
    categoryAr: "مضاد حيوي",
    activeIngredient: "Amoxicillin trihydrate",
    activeIngredientAr: "أموكسيسيلين ثلاثي الهيدرات",
    dosageForm: "Tablet, Liquid",
    dosageFormAr: "قرص، سائل",
    strength: "250mg, 500mg",
    strengthAr: "250 ملغ، 500 ملغ",
    dosagePerKg: 25,
    maxDosage: 500,
    frequency: "Every 8 hours",
    frequencyAr: "كل 8 ساعات",
    duration: 7,
    affectedSpecies: ["dog", "cat"],
    indications: ["Bacterial infections", "Urinary tract infections"],
    indicationsAr: ["العدوى البكتيرية", "عدوى المسالك البولية"],
    contraindications: ["Penicillin allergy"],
    contraindicationsAr: ["حساسية البنسلين"],
    sideEffects: ["Diarrhea", "Vomiting", "Allergic reaction"],
    sideEffectsAr: ["الإسهال", "القيء", "رد فعل تحسسي"],
    interactions: ["Methotrexate", "Warfarin"],
    interactionsAr: ["الميثوتريكسات", "الوارفارين"],
    storageCondition: "Room temperature, dry place",
    storageConditionAr: "درجة حرارة الغرفة، مكان جاف",
    prescriptionRequired: true,
    price: 45.99,
    priceCurrency: "EGP",
  },
  {
    name: "Doxycycline",
    nameAr: "الدوكسيسيكلين",
    category: "antibiotic",
    categoryAr: "مضاد حيوي",
    activeIngredient: "Doxycycline hyclate",
    activeIngredientAr: "هيدروكلوريد الدوكسيسيكلين",
    dosageForm: "Tablet, Capsule",
    dosageFormAr: "قرص، كبسولة",
    strength: "100mg",
    strengthAr: "100 ملغ",
    dosagePerKg: 10,
    maxDosage: 200,
    frequency: "Every 12 hours",
    frequencyAr: "كل 12 ساعة",
    duration: 10,
    affectedSpecies: ["dog", "cat"],
    indications: ["Respiratory infections", "Lyme disease", "Tick-borne infections"],
    indicationsAr: ["عدوى الجهاز التنفسي", "مرض لايم", "العدوى المنقولة بالقراد"],
    contraindications: ["Pregnancy", "Tetracycline allergy"],
    contraindicationsAr: ["الحمل", "حساسية التتراسيكلين"],
    sideEffects: ["Photosensitivity", "Nausea", "Diarrhea"],
    sideEffectsAr: ["حساسية الضوء", "الغثيان", "الإسهال"],
    interactions: ["Antacids", "Iron supplements"],
    interactionsAr: ["مضادات الحموضة", "مكملات الحديد"],
    storageCondition: "Room temperature, away from light",
    storageConditionAr: "درجة حرارة الغرفة، بعيداً عن الضوء",
    prescriptionRequired: true,
    price: 52.50,
    priceCurrency: "EGP",
  },
  // Pain Management
  {
    name: "Carprofen",
    nameAr: "كاربوبروفين",
    category: "pain_management",
    categoryAr: "إدارة الألم",
    activeIngredient: "Carprofen",
    activeIngredientAr: "كاربوبروفين",
    dosageForm: "Tablet",
    dosageFormAr: "قرص",
    strength: "25mg, 75mg, 100mg",
    strengthAr: "25 ملغ، 75 ملغ، 100 ملغ",
    dosagePerKg: 4.4,
    maxDosage: 100,
    frequency: "Every 12 hours",
    frequencyAr: "كل 12 ساعة",
    duration: 14,
    affectedSpecies: ["dog"],
    indications: ["Arthritis", "Post-operative pain", "Inflammation"],
    indicationsAr: ["التهاب المفاصل", "ألم ما بعد الجراحة", "الالتهاب"],
    contraindications: ["Kidney disease", "Liver disease", "GI ulcers"],
    contraindicationsAr: ["أمراض الكلى", "أمراض الكبد", "قرحة الجهاز الهضمي"],
    sideEffects: ["Vomiting", "Diarrhea", "Decreased appetite"],
    sideEffectsAr: ["القيء", "الإسهال", "تقليل الشهية"],
    interactions: ["Other NSAIDs", "Corticosteroids"],
    interactionsAr: ["مضادات الالتهاب الأخرى", "الكورتيكوستيرويدات"],
    storageCondition: "Room temperature",
    storageConditionAr: "درجة حرارة الغرفة",
    prescriptionRequired: true,
    price: 65.00,
    priceCurrency: "EGP",
  },
  // Vaccines
  {
    name: "DHPP Vaccine",
    nameAr: "لقاح DHPP",
    category: "vaccine",
    categoryAr: "لقاح",
    activeIngredient: "Distemper, Hepatitis, Parvovirus, Parainfluenza",
    activeIngredientAr: "الطاعون، التهاب الكبد، الباروفيروس، شلل الأطفال",
    dosageForm: "Injection",
    dosageFormAr: "حقن",
    strength: "1mL",
    strengthAr: "1 ملل",
    dosagePerKg: 0.1,
    maxDosage: 1,
    frequency: "Annual booster",
    frequencyAr: "معزز سنوي",
    duration: 365,
    affectedSpecies: ["dog"],
    indications: ["Disease prevention", "Puppy vaccination"],
    indicationsAr: ["الوقاية من الأمراض", "تطعيم الجراء"],
    contraindications: ["Severe illness", "Immunocompromised"],
    contraindicationsAr: ["مرض شديد", "ضعف المناعة"],
    sideEffects: ["Mild fever", "Lethargy", "Injection site reaction"],
    sideEffectsAr: ["حمى خفيفة", "خمول", "رد فعل موقع الحقن"],
    interactions: ["None significant"],
    interactionsAr: ["لا توجد تفاعلات كبيرة"],
    storageCondition: "2-8°C refrigerated",
    storageConditionAr: "2-8 درجة مئوية مبردة",
    prescriptionRequired: false,
    price: 35.00,
    priceCurrency: "EGP",
  },
  // Antiparasitic
  {
    name: "Ivermectin",
    nameAr: "إيفرمكتين",
    category: "antiparasitic",
    categoryAr: "مضاد للطفيليات",
    activeIngredient: "Ivermectin",
    activeIngredientAr: "إيفرمكتين",
    dosageForm: "Injection, Oral",
    dosageFormAr: "حقن، فموي",
    strength: "1%, 6mg/mL",
    strengthAr: "1٪، 6 ملغ/مل",
    dosagePerKg: 0.2,
    maxDosage: 20,
    frequency: "Every 2 weeks",
    frequencyAr: "كل أسبوعين",
    duration: 8,
    affectedSpecies: ["dog", "cat"],
    indications: ["Heartworm prevention", "Mange", "Parasites"],
    indicationsAr: ["الوقاية من الديدان القلبية", "الجرب", "الطفيليات"],
    contraindications: ["Collie breeds (sensitivity)", "Pregnancy"],
    contraindicationsAr: ["سلالات كولي (حساسية)", "الحمل"],
    sideEffects: ["Tremors", "Lethargy", "Dilated pupils"],
    sideEffectsAr: ["الارتجاج", "الخمول", "تمدد الحدقة"],
    interactions: ["P-glycoprotein inhibitors"],
    interactionsAr: ["مثبطات P-glycoprotein"],
    storageCondition: "Room temperature",
    storageConditionAr: "درجة حرارة الغرفة",
    prescriptionRequired: true,
    price: 38.50,
    priceCurrency: "EGP",
  },
  // Antifungal
  {
    name: "Fluconazole",
    nameAr: "فلوكونازول",
    category: "antifungal",
    categoryAr: "مضاد للفطريات",
    activeIngredient: "Fluconazole",
    activeIngredientAr: "فلوكونازول",
    dosageForm: "Tablet, Suspension",
    dosageFormAr: "قرص، معلق",
    strength: "50mg, 100mg",
    strengthAr: "50 ملغ، 100 ملغ",
    dosagePerKg: 5,
    maxDosage: 200,
    frequency: "Every 12 hours",
    frequencyAr: "كل 12 ساعة",
    duration: 21,
    affectedSpecies: ["dog", "cat"],
    indications: ["Fungal infections", "Yeast infections", "Ringworm"],
    indicationsAr: ["العدوى الفطرية", "عدوى الخميرة", "السعفة"],
    contraindications: ["Liver disease", "Drug interactions"],
    contraindicationsAr: ["أمراض الكبد", "تفاعلات الأدوية"],
    sideEffects: ["Nausea", "Vomiting", "Diarrhea"],
    sideEffectsAr: ["الغثيان", "القيء", "الإسهال"],
    interactions: ["Cyclosporine", "Warfarin"],
    interactionsAr: ["السيكلوسبورين", "الوارفارين"],
    storageCondition: "Room temperature",
    storageConditionAr: "درجة حرارة الغرفة",
    prescriptionRequired: true,
    price: 48.75,
    priceCurrency: "EGP",
  },
];

export async function seedMedications() {
  try {
    console.log("🌱 Seeding medications database...");

    for (const medication of medicationsData) {
      await db.insert(medications).values({
        ...medication,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`✅ Successfully seeded ${medicationsData.length} medications`);
  } catch (error) {
    console.error("❌ Error seeding medications:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMedications()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
