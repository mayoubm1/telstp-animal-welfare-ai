import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

const bestPracticesArticles = [
  {
    id: 1,
    titleAr: "التغذية الصحيحة للكلاب",
    titleEn: "Proper Dog Nutrition",
    categoryAr: "التغذية",
    categoryEn: "Nutrition",
    descriptionAr: "دليل شامل لتغذية الكلاب الصحية والمتوازنة",
    descriptionEn: "Comprehensive guide to healthy and balanced dog nutrition",
    contentAr: `التغذية الصحيحة هي أساس صحة الكلب. يجب أن تحتوي وجبات الكلب على:

• البروتينات: 18-25% من السعرات الحرارية اليومية
• الدهون: 5-15% من السعرات الحرارية اليومية
• الكربوهيدرات: المتبقي من السعرات الحرارية
• الفيتامينات والمعادن: ضرورية للصحة العامة

نصائح مهمة:
✓ اختر طعاماً عالي الجودة معتمداً
✓ تجنب الأطعمة السامة (الشوكولاتة، العنب، البصل)
✓ قدم وجبات منتظمة في أوقات محددة
✓ وفر ماء نظيف دائماً
✓ استشر الطبيب البيطري قبل تغيير الطعام

الكلاب الصغيرة تحتاج 3-4 وجبات يومياً، بينما الكلاب البالغة تحتاج وجبة أو وجبتين.`,
    contentEn: `Proper nutrition is the foundation of dog health. Dog meals should contain:

• Proteins: 18-25% of daily calories
• Fats: 5-15% of daily calories
• Carbohydrates: Remaining calories
• Vitamins and minerals: Essential for overall health

Important tips:
✓ Choose high-quality approved food
✓ Avoid toxic foods (chocolate, grapes, onions)
✓ Provide regular meals at set times
✓ Always provide clean water
✓ Consult veterinarian before changing food

Puppies need 3-4 meals daily, while adult dogs need one or two meals.`,
    petTypesAr: "الكلاب",
    petTypesEn: "Dogs",
    difficultyAr: "مبتدئ",
    difficultyEn: "Beginner",
  },
  {
    id: 2,
    titleAr: "العناية بأسنان القطط",
    titleEn: "Cat Dental Care",
    categoryAr: "العناية الصحية",
    categoryEn: "Health Care",
    descriptionAr: "كيفية الحفاظ على صحة أسنان القطط",
    descriptionEn: "How to maintain cat dental health",
    contentAr: `صحة الأسنان مهمة جداً للقطط. تشير الدراسات إلى أن 90% من القطط فوق سن 4 سنوات تعاني من أمراض الأسنان.

علامات مشاكل الأسنان:
• رائحة الفم الكريهة
• سيلان اللعاب المفرط
• صعوبة في الأكل
• تورم الوجه أو الفك
• فقدان الأسنان

طرق الوقاية:
✓ نظف أسنان القطة يومياً بفرشاة ناعمة
✓ استخدم معجون أسنان خاص بالقطط
✓ قدم الأطعمة الصلبة التي تساعد على تنظيف الأسنان
✓ زر الطبيب البيطري كل 6 أشهر
✓ قد تحتاج لتنظيف احترافي سنوياً`,
    contentEn: `Dental health is very important for cats. Studies show that 90% of cats over 4 years old suffer from dental disease.

Signs of dental problems:
• Bad breath
• Excessive drooling
• Difficulty eating
• Facial or jaw swelling
• Tooth loss

Prevention methods:
✓ Brush cat's teeth daily with soft brush
✓ Use cat-specific toothpaste
✓ Provide hard foods that help clean teeth
✓ Visit veterinarian every 6 months
✓ May need professional cleaning annually`,
    petTypesAr: "القطط",
    petTypesEn: "Cats",
    difficultyAr: "متوسط",
    difficultyEn: "Intermediate",
  },
  {
    id: 3,
    titleAr: "التطعيمات الأساسية للحيوانات الأليفة",
    titleEn: "Essential Pet Vaccinations",
    categoryAr: "الوقاية",
    categoryEn: "Prevention",
    descriptionAr: "جدول التطعيمات الموصى به للكلاب والقطط",
    descriptionEn: "Recommended vaccination schedule for dogs and cats",
    contentAr: `التطعيمات ضرورية لحماية حيوانك الأليف من الأمراض الخطيرة.

تطعيمات الكلاب الأساسية:
• داء الكلب (Rabies): ضرورية قانونياً
• الطاعون (DHPP): تغطي ديستمبر، الكبد، البارفو، الباراإنفلونزا
• الإنفلونزا: موصى به
• البورديتيلا: موصى به للكلاب الاجتماعية

تطعيمات القطط الأساسية:
• داء الكلب (Rabies): ضرورية قانونياً
• الفيروس الثلاثي (FVRCP): تغطي الكاليسي، الهربس، البانليكوبينيا
• اللوكيميا (FeLV): موصى به

جدول التطعيمات:
✓ الجرعة الأولى: 6-8 أسابيع
✓ الجرعة الثانية: 10-12 أسبوع
✓ الجرعة الثالثة: 14-16 أسبوع
✓ معزز سنوي أو كل 3 سنوات حسب التطعيم`,
    contentEn: `Vaccinations are essential to protect your pet from dangerous diseases.

Essential dog vaccinations:
• Rabies: Legally required
• DHPP: Covers distemper, hepatitis, parvo, parainfluenza
• Influenza: Recommended
• Bordetella: Recommended for social dogs

Essential cat vaccinations:
• Rabies: Legally required
• FVRCP: Covers calicivirus, herpes, panleukopenia
• FeLV: Recommended

Vaccination schedule:
✓ First dose: 6-8 weeks
✓ Second dose: 10-12 weeks
✓ Third dose: 14-16 weeks
✓ Annual or 3-year booster depending on vaccine`,
    petTypesAr: "الكلاب، القطط",
    petTypesEn: "Dogs, Cats",
    difficultyAr: "مبتدئ",
    difficultyEn: "Beginner",
  },
  {
    id: 4,
    titleAr: "التدريب السلوكي الإيجابي",
    titleEn: "Positive Behavioral Training",
    categoryAr: "السلوك والتدريب",
    categoryEn: "Behavior & Training",
    descriptionAr: "تقنيات التدريب الإيجابية لتحسين سلوك الحيوان",
    descriptionEn: "Positive training techniques to improve pet behavior",
    contentAr: `التدريب الإيجابي يعتمد على المكافآت والتعزيز بدلاً من العقاب.

المبادئ الأساسية:
• استخدم المكافآت (الطعام، اللعب، المدح)
• كن صبوراً ومتسقاً
• ركز على السلوك المرغوب
• تجنب العقاب البدني
• ابدأ بأوامر بسيطة

خطوات التدريب:
1. اختر مكافأة يحبها الحيوان
2. اختر أمراً بسيطاً وواضحاً
3. علم الحيوان الأمر تدريجياً
4. كافئ الاستجابة الصحيحة فوراً
5. كرر التدريب يومياً لمدة 10-15 دقيقة
6. زد التعقيد تدريجياً

الأوامر الأساسية:
✓ اجلس (Sit)
✓ ابقَ (Stay)
✓ تعال (Come)
✓ استلقِ (Down)
✓ اترك (Leave it)`,
    contentEn: `Positive training relies on rewards and reinforcement instead of punishment.

Basic principles:
• Use rewards (food, play, praise)
• Be patient and consistent
• Focus on desired behavior
• Avoid physical punishment
• Start with simple commands

Training steps:
1. Choose a reward your pet loves
2. Choose a simple, clear command
3. Teach the command gradually
4. Reward correct response immediately
5. Practice daily for 10-15 minutes
6. Increase complexity gradually

Basic commands:
✓ Sit
✓ Stay
✓ Come
✓ Down
✓ Leave it`,
    petTypesAr: "الكلاب، القطط",
    petTypesEn: "Dogs, Cats",
    difficultyAr: "متوسط",
    difficultyEn: "Intermediate",
  },
  {
    id: 5,
    titleAr: "الإسعافات الأولية للحيوانات الأليفة",
    titleEn: "Pet First Aid",
    categoryAr: "الطوارئ",
    categoryEn: "Emergency",
    descriptionAr: "كيفية التعامل مع حالات الطوارئ الشائعة",
    descriptionEn: "How to handle common emergency situations",
    contentAr: `معرفة الإسعافات الأولية قد تنقذ حياة حيوانك الأليف.

النزيف الحاد:
✓ اضغط على الجرح بقطعة قماش نظيفة
✓ حافظ على الضغط لمدة 10-15 دقيقة
✓ استخدم ضمادة ضاغطة
✓ اتصل بالطبيب البيطري فوراً

الاختناق:
✓ حاول إزالة الجسم الغريب برفق
✓ إذا لم تستطع، لا تحاول بقوة
✓ اذهب للطبيب البيطري فوراً
✓ قد تحتاج لعملية جراحية

التسمم:
✓ تحديد المادة السامة إن أمكن
✓ لا تحاول تحريض القيء بدون استشارة
✓ اتصل بمركز السموم أو الطبيب البيطري
✓ احفظ عينة من المادة السامة

الحروق:
✓ برد المنطقة بماء بارد (ليس ثلج)
✓ لا تضع مراهم
✓ غطِ بضمادة نظيفة
✓ اذهب للطبيب البيطري

ملاحظة مهمة: هذه معلومات تعليمية فقط. اتصل بالطبيب البيطري فوراً في حالات الطوارئ.`,
    contentEn: `Knowing first aid could save your pet's life.

Severe bleeding:
✓ Apply pressure with clean cloth
✓ Maintain pressure for 10-15 minutes
✓ Use compression bandage
✓ Call veterinarian immediately

Choking:
✓ Try to gently remove foreign object
✓ If unable, don't force it
✓ Go to veterinarian immediately
✓ May need surgery

Poisoning:
✓ Identify toxic substance if possible
✓ Don't induce vomiting without advice
✓ Call poison center or veterinarian
✓ Keep sample of toxic substance

Burns:
✓ Cool area with cool water (not ice)
✓ Don't apply ointments
✓ Cover with clean bandage
✓ Go to veterinarian

Important note: This is educational information only. Call veterinarian immediately in emergencies.`,
    petTypesAr: "جميع الحيوانات الأليفة",
    petTypesEn: "All Pets",
    difficultyAr: "متقدم",
    difficultyEn: "Advanced",
  },
  {
    id: 6,
    titleAr: "ممارسة الرياضة والنشاط البدني",
    titleEn: "Exercise and Physical Activity",
    categoryAr: "الصحة واللياقة",
    categoryEn: "Health & Fitness",
    descriptionAr: "أهمية التمرين المنتظم لصحة الحيوان",
    descriptionEn: "Importance of regular exercise for pet health",
    contentAr: `التمرين المنتظم ضروري لصحة الحيوان الجسدية والعقلية.

فوائد التمرين:
✓ تحسين اللياقة البدنية
✓ تقليل السلوك المشكل
✓ تحسين الصحة العقلية
✓ تقليل السمنة
✓ تحسين الهضم

احتياجات التمرين حسب النوع:
الكلاب:
• الكلاب الصغيرة: 30 دقيقة يومياً
• الكلاب المتوسطة: 45-60 دقيقة يومياً
• الكلاب الكبيرة: 60-90 دقيقة يومياً
• كلاب العمل: 90+ دقيقة يومياً

القطط:
• 15-30 دقيقة لعب يومياً
• استخدم الألعاب التفاعلية
• شجع على الصيد الطبيعي

أنواع التمرين:
✓ المشي السريع
✓ الركض والقفز
✓ السباحة
✓ اللعب التفاعلي
✓ تدريب الرشاقة

نصائح مهمة:
• ابدأ بتمرين خفيف وزد تدريجياً
• تجنب التمرين الشديد في الطقس الحار
• وفر ماء كافي
• راقب علامات الإرهاق
• استشر الطبيب قبل تمرين شديد`,
    contentEn: `Regular exercise is essential for pet physical and mental health.

Benefits of exercise:
✓ Improved physical fitness
✓ Reduced problematic behavior
✓ Improved mental health
✓ Reduced obesity
✓ Improved digestion

Exercise needs by type:
Dogs:
• Small dogs: 30 minutes daily
• Medium dogs: 45-60 minutes daily
• Large dogs: 60-90 minutes daily
• Working dogs: 90+ minutes daily

Cats:
• 15-30 minutes play daily
• Use interactive toys
• Encourage natural hunting

Types of exercise:
✓ Brisk walking
✓ Running and jumping
✓ Swimming
✓ Interactive play
✓ Agility training

Important tips:
• Start with light exercise and increase gradually
• Avoid intense exercise in hot weather
• Provide adequate water
• Watch for signs of exhaustion
• Consult veterinarian before intense exercise`,
    petTypesAr: "الكلاب، القطط",
    petTypesEn: "Dogs, Cats",
    difficultyAr: "مبتدئ",
    difficultyEn: "Beginner",
  },
];

export default function BestPracticesEnhanced() {
  const [isArabic, setIsArabic] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = [
    { id: "all", labelAr: "الكل", labelEn: "All" },
    { id: "nutrition", labelAr: "التغذية", labelEn: "Nutrition" },
    { id: "healthcare", labelAr: "العناية الصحية", labelEn: "Health Care" },
    { id: "prevention", labelAr: "الوقاية", labelEn: "Prevention" },
    { id: "behavior", labelAr: "السلوك والتدريب", labelEn: "Behavior & Training" },
    { id: "emergency", labelAr: "الطوارئ", labelEn: "Emergency" },
    { id: "fitness", labelAr: "الصحة واللياقة", labelEn: "Health & Fitness" },
  ];

  const filteredArticles = bestPracticesArticles.filter((article) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      article.titleAr.toLowerCase().includes(searchLower) ||
      article.titleEn.toLowerCase().includes(searchLower) ||
      article.descriptionAr.toLowerCase().includes(searchLower) ||
      article.descriptionEn.toLowerCase().includes(searchLower);

    if (!selectedCategory || selectedCategory === "all") return matchesSearch;
    return matchesSearch && article.categoryEn.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "Beginner" || difficulty === "مبتدئ") return "bg-green-500/20 text-green-300 border-green-500/30";
    if (difficulty === "Intermediate" || difficulty === "متوسط") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    return "bg-red-500/20 text-red-300 border-red-500/30";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden ${isArabic ? "rtl" : "ltr"}`}>
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full backdrop-blur">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">
              {isArabic ? "✅ أفضل الممارسات المثبتة" : "✅ Proven Best Practices"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent`}>
          {isArabic ? "📚 أفضل الممارسات" : "📚 Best Practices"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
          {isArabic
            ? "مجموعة شاملة من أفضل الممارسات والنصائح المثبتة لرعاية حيوانك الأليف"
            : "Comprehensive collection of proven best practices and tips for pet care"}
        </p>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(true)}
            className={isArabic ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            العربية
          </Button>
          <Button
            variant={!isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(false)}
            className={!isArabic ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            English
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 max-w-2xl mx-auto px-4 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <Input
            placeholder={isArabic ? "ابحث عن المقالات..." : "Search articles..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 bg-slate-900/50 border-blue-500/30 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
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
              className={selectedCategory === cat.id ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500/30 text-blue-300 hover:border-blue-500"}
            >
              {isArabic ? cat.labelAr : cat.labelEn}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="bg-slate-900/50 border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer"
              onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-blue-300 text-lg">
                      {isArabic ? article.titleAr : article.titleEn}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {isArabic ? article.categoryAr : article.categoryEn}
                    </CardDescription>
                  </div>
                  <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Description */}
                <p className="text-sm text-gray-300">{isArabic ? article.descriptionAr : article.descriptionEn}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {isArabic ? article.petTypesAr : article.petTypesEn}
                  </Badge>
                  <Badge className={getDifficultyColor(isArabic ? article.difficultyAr : article.difficultyEn)}>
                    {isArabic ? article.difficultyAr : article.difficultyEn}
                  </Badge>
                </div>

                {/* Expandable Content */}
                {expandedId === article.id && (
                  <div className="mt-4 pt-4 border-t border-blue-500/20">
                    <div className="bg-slate-800/50 rounded p-4 text-sm text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {isArabic ? article.contentAr : article.contentEn}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  {isArabic ? "اضغط لقراءة المقالة الكاملة" : "Click to read full article"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {isArabic ? "لم يتم العثور على مقالات" : "No articles found"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-12">
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                {isArabic
                  ? "💡 هذه المقالات تحتوي على معلومات تعليمية عامة. استشر الطبيب البيطري دائماً للحصول على نصيحة متخصصة لحالة حيوانك الأليف."
                  : "💡 These articles contain general educational information. Always consult a veterinarian for specialized advice about your pet's specific situation."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
