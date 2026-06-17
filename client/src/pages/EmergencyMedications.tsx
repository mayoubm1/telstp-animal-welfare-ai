import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, Pill, AlertTriangle, Info } from "lucide-react";

const emergencyMedications = [
  {
    id: 1,
    nameAr: "الأدرينالين (الإبينفرين)",
    nameEn: "Adrenaline (Epinephrine)",
    categoryAr: "حالات الطوارئ",
    categoryEn: "Emergency",
    indicationsAr: "الصدمة التحسسية، فشل القلب، توقف التنفس",
    indicationsEn: "Anaphylactic shock, cardiac arrest, respiratory failure",
    dosageAr: "0.01 ملغ/كغ عضلي أو وريدي",
    dosageEn: "0.01 mg/kg IM or IV",
    sideEffectsAr: "زيادة ضربات القلب، القلق، الرعشة",
    sideEffectsEn: "Increased heart rate, anxiety, tremors",
    warningsAr: "استخدم بحذر في أمراض القلب",
    warningsEn: "Use cautiously in cardiac disease",
    petTypesAr: "الكلاب، القطط، الأرانب",
    petTypesEn: "Dogs, Cats, Rabbits",
  },
  {
    id: 2,
    nameAr: "ديفينهيدرامين",
    nameEn: "Diphenhydramine",
    categoryAr: "مضادات الحساسية",
    categoryEn: "Antihistamine",
    indicationsAr: "الحساسية، الحكة، الوذمة الوعائية",
    indicationsEn: "Allergies, itching, angioedema",
    dosageAr: "1-2 ملغ/كغ فموي كل 6-8 ساعات",
    dosageEn: "1-2 mg/kg PO every 6-8 hours",
    sideEffectsAr: "النعاس، جفاف الفم، الإمساك",
    sideEffectsEn: "Drowsiness, dry mouth, constipation",
    warningsAr: "قد يسبب النعاس، تجنب القيادة",
    warningsEn: "May cause drowsiness, avoid driving",
    petTypesAr: "الكلاب، القطط، الأرانب، الطيور",
    petTypesEn: "Dogs, Cats, Rabbits, Birds",
  },
  {
    id: 3,
    nameAr: "الأمينوفيللين",
    nameEn: "Aminophylline",
    categoryAr: "أمراض التنفس",
    categoryEn: "Respiratory",
    indicationsAr: "الربو، ضيق التنفس، الانسداد الرئوي",
    indicationsEn: "Asthma, dyspnea, bronchospasm",
    dosageAr: "5-10 ملغ/كغ وريدي ببطء",
    dosageEn: "5-10 mg/kg IV slowly",
    sideEffectsAr: "الغثيان، القيء، الأرق",
    sideEffectsEn: "Nausea, vomiting, restlessness",
    warningsAr: "راقب ضربات القلب، قد تسبب عدم انتظام",
    warningsEn: "Monitor heart rate, may cause arrhythmias",
    petTypesAr: "الكلاب، القطط",
    petTypesEn: "Dogs, Cats",
  },
  {
    id: 4,
    nameAr: "سلفات الباريوم (قيء)",
    nameEn: "Barium Sulfate (Emetic)",
    categoryAr: "التسمم",
    categoryEn: "Poisoning",
    indicationsAr: "التسمم، ابتلاع أجسام غريبة حديثة",
    indicationsEn: "Poisoning, recent foreign body ingestion",
    dosageAr: "1-2 ملغ/كغ فموي",
    dosageEn: "1-2 mg/kg PO",
    sideEffectsAr: "الجفاف، عدم التوازن الكهربائي",
    sideEffectsEn: "Dehydration, electrolyte imbalance",
    warningsAr: "لا تستخدم في حالة الجسم الحاد أو المسبب للثقب",
    warningsEn: "Do not use with sharp or caustic objects",
    petTypesAr: "الكلاب، القطط",
    petTypesEn: "Dogs, Cats",
  },
  {
    id: 5,
    nameAr: "الديكساميثازون",
    nameEn: "Dexamethasone",
    categoryAr: "الالتهاب والصدمة",
    categoryEn: "Inflammation & Shock",
    indicationsAr: "الصدمة، الوذمة الدماغية، الالتهاب الشديد",
    indicationsEn: "Shock, cerebral edema, severe inflammation",
    dosageAr: "0.1-1 ملغ/كغ وريدي",
    dosageEn: "0.1-1 mg/kg IV",
    sideEffectsAr: "زيادة الشهية، العطش، ضعف المناعة",
    sideEffectsEn: "Increased appetite, thirst, immunosuppression",
    warningsAr: "قد يسبب قرحة المعدة، استخدم مع الحماية المعدية",
    warningsEn: "May cause gastric ulcers, use with gastroprotection",
    petTypesAr: "الكلاب، القطط، الأرانب",
    petTypesEn: "Dogs, Cats, Rabbits",
  },
  {
    id: 6,
    nameAr: "الأتروبين",
    nameEn: "Atropine",
    categoryAr: "السموم",
    categoryEn: "Antidote",
    indicationsAr: "التسمم بمبيدات الحشرات، بطء ضربات القلب",
    indicationsEn: "Pesticide poisoning, bradycardia",
    dosageAr: "0.02-0.04 ملغ/كغ وريدي أو عضلي",
    dosageEn: "0.02-0.04 mg/kg IV or IM",
    sideEffectsAr: "جفاف الفم، توسع الحدقة، زيادة ضربات القلب",
    sideEffectsEn: "Dry mouth, dilated pupils, tachycardia",
    warningsAr: "قد يسبب الإمساك والتبول الصعب",
    warningsEn: "May cause constipation and difficult urination",
    petTypesAr: "الكلاب، القطط",
    petTypesEn: "Dogs, Cats",
  },
  {
    id: 7,
    nameAr: "محلول الملح الفسيولوجي",
    nameEn: "Saline Solution (0.9% NaCl)",
    categoryAr: "السوائل",
    categoryEn: "Fluids",
    indicationsAr: "الجفاف، الصدمة، فقدان الدم",
    indicationsEn: "Dehydration, shock, blood loss",
    dosageAr: "20-40 مل/كغ وريدي ببطء",
    dosageEn: "20-40 mL/kg IV slowly",
    sideEffectsAr: "الإفراط في السوائل قد يسبب الوذمة",
    sideEffectsEn: "Fluid overload may cause edema",
    warningsAr: "راقب مستويات الكهرباء، قد تسبب فرط الصوديوم",
    warningsEn: "Monitor electrolytes, may cause hypernatremia",
    petTypesAr: "جميع الحيوانات الأليفة",
    petTypesEn: "All pets",
  },
  {
    id: 8,
    nameAr: "الفحم المنشط",
    nameEn: "Activated Charcoal",
    categoryAr: "التسمم",
    categoryEn: "Poisoning",
    indicationsAr: "ابتلاع السموم، الأدوية الزائدة",
    indicationsEn: "Toxin ingestion, drug overdose",
    dosageAr: "1-3 غرام/كغ فموي",
    dosageEn: "1-3 g/kg PO",
    sideEffectsAr: "الإمساك، البراز الأسود، الغثيان",
    sideEffectsEn: "Constipation, black stool, nausea",
    warningsAr: "لا تستخدم مع السموم الحادة أو المعادن الثقيلة",
    warningsEn: "Do not use with caustic toxins or heavy metals",
    petTypesAr: "الكلاب، القطط",
    petTypesEn: "Dogs, Cats",
  },
  {
    id: 9,
    nameAr: "الأمبيسيلين",
    nameEn: "Ampicillin",
    categoryAr: "المضادات الحيوية",
    categoryEn: "Antibiotics",
    indicationsAr: "العدوى البكتيرية، الجروح المصابة",
    indicationsEn: "Bacterial infection, infected wounds",
    dosageAr: "10-20 ملغ/كغ وريدي أو عضلي كل 6-8 ساعات",
    dosageEn: "10-20 mg/kg IV or IM every 6-8 hours",
    sideEffectsAr: "الحساسية، الإسهال، الغثيان",
    sideEffectsEn: "Allergic reactions, diarrhea, nausea",
    warningsAr: "تأكد من عدم الحساسية من البنسلين قبل الاستخدام",
    warningsEn: "Verify no penicillin allergy before use",
    petTypesAr: "الكلاب، القطط، الأرانب",
    petTypesEn: "Dogs, Cats, Rabbits",
  },
  {
    id: 10,
    nameAr: "مثيلبريدنيزولون",
    nameEn: "Methylprednisolone",
    categoryAr: "الالتهاب",
    categoryEn: "Anti-inflammatory",
    indicationsAr: "الالتهاب الحاد، الصدمة، الحساسية الشديدة",
    indicationsEn: "Acute inflammation, shock, severe allergies",
    dosageAr: "10-30 ملغ/كغ وريدي",
    dosageEn: "10-30 mg/kg IV",
    sideEffectsAr: "زيادة الشهية، العطش، الأرق",
    sideEffectsEn: "Increased appetite, thirst, restlessness",
    warningsAr: "قد يسبب قرحة المعدة، استخدم مع الحماية",
    warningsEn: "May cause gastric ulcers, use with protection",
    petTypesAr: "الكلاب، القطط، الأرانب",
    petTypesEn: "Dogs, Cats, Rabbits",
  },
];

export default function EmergencyMedications() {
  const [isArabic, setIsArabic] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = [
    { id: "all", labelAr: "الكل", labelEn: "All" },
    { id: "emergency", labelAr: "حالات الطوارئ", labelEn: "Emergency" },
    { id: "antihistamine", labelAr: "مضادات الحساسية", labelEn: "Antihistamine" },
    { id: "respiratory", labelAr: "أمراض التنفس", labelEn: "Respiratory" },
    { id: "poisoning", labelAr: "التسمم", labelEn: "Poisoning" },
    { id: "antidote", labelAr: "السموم", labelEn: "Antidote" },
    { id: "fluids", labelAr: "السوائل", labelEn: "Fluids" },
    { id: "antibiotics", labelAr: "المضادات الحيوية", labelEn: "Antibiotics" },
  ];

  const filteredMeds = emergencyMedications.filter((med) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      med.nameAr.toLowerCase().includes(searchLower) ||
      med.nameEn.toLowerCase().includes(searchLower) ||
      med.indicationsAr.toLowerCase().includes(searchLower) ||
      med.indicationsEn.toLowerCase().includes(searchLower);

    if (!selectedCategory || selectedCategory === "all") return matchesSearch;
    return matchesSearch && med.categoryEn.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden ${isArabic ? "rtl" : "ltr"}`}>
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full backdrop-blur">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-300">
              {isArabic ? "🚨 أدوية الطوارئ الحيوية" : "🚨 Critical Emergency Medications"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-300 via-orange-300 to-red-400 bg-clip-text text-transparent`}>
          {isArabic ? "💊 أدوية الطوارئ" : "💊 Emergency Medications"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
          {isArabic
            ? "دليل شامل للأدوية الحيوية في حالات الطوارئ البيطرية - الجرعات والآثار الجانبية والتحذيرات"
            : "Comprehensive guide to critical emergency veterinary medications - dosages, side effects, and warnings"}
        </p>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(true)}
            className={isArabic ? "bg-red-600 hover:bg-red-700" : ""}
          >
            العربية
          </Button>
          <Button
            variant={!isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(false)}
            className={!isArabic ? "bg-red-600 hover:bg-red-700" : ""}
          >
            English
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 max-w-2xl mx-auto px-4 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
          <Input
            placeholder={isArabic ? "ابحث عن الأدوية..." : "Search medications..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 bg-slate-900/50 border-red-500/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id === "all" ? null : cat.id)}
              className={selectedCategory === cat.id ? "bg-red-600 hover:bg-red-700" : "border-red-500/30 text-red-300 hover:border-red-500"}
            >
              {isArabic ? cat.labelAr : cat.labelEn}
            </Button>
          ))}
        </div>
      </div>

      {/* Medications Grid */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMeds.map((med) => (
            <Card
              key={med.id}
              className="bg-slate-900/50 border-red-500/30 hover:border-red-500/60 transition-all cursor-pointer"
              onClick={() => setExpandedId(expandedId === med.id ? null : med.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-red-300 text-lg">
                      {isArabic ? med.nameAr : med.nameEn}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {isArabic ? med.categoryAr : med.categoryEn}
                    </CardDescription>
                  </div>
                  <Pill className="w-5 h-5 text-red-400 flex-shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Indications */}
                <div>
                  <p className="text-sm font-semibold text-red-300 mb-1">
                    {isArabic ? "المؤشرات:" : "Indications:"}
                  </p>
                  <p className="text-sm text-gray-300">{isArabic ? med.indicationsAr : med.indicationsEn}</p>
                </div>

                {/* Dosage */}
                <div>
                  <p className="text-sm font-semibold text-orange-300 mb-1">
                    {isArabic ? "الجرعة:" : "Dosage:"}
                  </p>
                  <p className="text-sm text-gray-300 font-mono bg-slate-800/50 p-2 rounded">
                    {isArabic ? med.dosageAr : med.dosageEn}
                  </p>
                </div>

                {/* Pet Types */}
                <div className="flex flex-wrap gap-2">
                  {(isArabic ? med.petTypesAr : med.petTypesEn).split("،").map((pet, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                      {pet.trim()}
                    </Badge>
                  ))}
                </div>

                {/* Expandable Details */}
                {expandedId === med.id && (
                  <div className="mt-4 pt-4 border-t border-red-500/20 space-y-3">
                    {/* Side Effects */}
                    <div>
                      <p className="text-sm font-semibold text-yellow-300 mb-1">
                        {isArabic ? "الآثار الجانبية:" : "Side Effects:"}
                      </p>
                      <p className="text-sm text-gray-300">{isArabic ? med.sideEffectsAr : med.sideEffectsEn}</p>
                    </div>

                    {/* Warnings */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                      <div className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-300 mb-1">
                            {isArabic ? "تحذيرات:" : "Warnings:"}
                          </p>
                          <p className="text-sm text-gray-300">{isArabic ? med.warningsAr : med.warningsEn}</p>
                        </div>
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                      <div className="flex gap-2">
                        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-300">
                          {isArabic
                            ? "⚠️ يجب استخدام هذه الأدوية تحت إشراف بيطري متخصص فقط. هذا المرجع للتعليم فقط وليس بديلاً عن الاستشارة البيطرية."
                            : "⚠️ These medications must only be used under specialized veterinary supervision. This reference is for education only and not a substitute for veterinary consultation."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  {isArabic ? "اضغط للتفاصيل الكاملة" : "Click for full details"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMeds.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {isArabic ? "لم يتم العثور على أدوية" : "No medications found"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-12">
        <Card className="bg-slate-900/50 border-yellow-500/30">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-300">
              {isArabic
                ? "📌 هذا الدليل يحتوي على معلومات تعليمية عن الأدوية البيطرية الطارئة. يجب استشارة الطبيب البيطري قبل إعطاء أي دواء. في حالات الطوارئ، اتصل بأقرب عيادة بيطرية فوراً."
                : "📌 This guide contains educational information about emergency veterinary medications. Always consult a veterinarian before administering any medication. In emergencies, contact the nearest veterinary clinic immediately."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
