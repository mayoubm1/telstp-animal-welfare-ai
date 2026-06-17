import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Heart, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";

const ownerEducationModules = [
  {
    id: 1,
    titleAr: "أساسيات رعاية الحيوانات الأليفة",
    titleEn: "Pet Care Basics",
    iconAr: "🏠",
    iconEn: "🏠",
    descriptionAr: "المعلومات الأساسية التي يجب أن يعرفها كل مالك حيوان أليف",
    descriptionEn: "Essential information every pet owner should know",
    contentAr: `
## أساسيات رعاية الحيوانات الأليفة

### 1. الاحتياجات الأساسية
كل حيوان أليف يحتاج إلى:
- **الغذاء الصحي**: طعام عالي الجودة مناسب لعمره ونوعه
- **الماء النظيف**: متاح دائماً طوال اليوم
- **المأوى الآمن**: مكان نظيف وآمن للراحة
- **التمرين**: نشاط بدني منتظم
- **الرعاية الطبية**: فحوصات دورية وتطعيمات

### 2. الرعاية الصحية
- **الفحوصات الدورية**: زيارة الطبيب البيطري مرة أو مرتين سنوياً
- **التطعيمات**: حماية من الأمراض المعدية
- **الوقاية من الطفيليات**: علاجات ضد البراغيث والديدان
- **صحة الأسنان**: تنظيف منتظم ومراقبة
- **الصحة العقلية**: الحب والاهتمام والتفاعل الاجتماعي

### 3. النظافة والصحة
- **الاستحمام**: حسب نوع الحيوان (كل 4-6 أسابيع للكلاب)
- **تنظيف الأذنين**: منع العدوى
- **قص الأظافر**: تجنب المشاكل في المشي
- **تنظيف الأسنان**: يومياً إن أمكن
- **نظافة المكان**: تنظيف دوري للمنزل والفراش

### 4. السلوك والتدريب
- **التدريب المبكر**: ابدأ من الصغر
- **التعزيز الإيجابي**: استخدم المكافآت
- **الصبر والاستمرارية**: التدريب يحتاج وقتاً
- **الاجتماعية**: تعريض الحيوان لأشخاص وحيوانات مختلفة
- **الحدود الواضحة**: علم حيوانك ما هو مقبول

### 5. الأمان والحماية
- **التطعيم ضد داء الكلب**: إلزامي قانونياً في معظم الدول
- **الرقاقة الإلكترونية**: تساعد في العثور على الحيوان الضائع
- **التأمين الصحي**: قد يساعد في تغطية النفقات الطبية
- **الإشراف**: لا تترك الحيوان وحيداً لفترات طويلة
- **البيئة الآمنة**: إزالة الأشياء الخطرة والسامة
`,
    contentEn: `
## Pet Care Basics

### 1. Essential Needs
Every pet needs:
- **Healthy food**: High-quality food appropriate for age and type
- **Clean water**: Available all day
- **Safe shelter**: Clean and safe place to rest
- **Exercise**: Regular physical activity
- **Medical care**: Regular checkups and vaccinations

### 2. Healthcare
- **Regular checkups**: Visit veterinarian once or twice yearly
- **Vaccinations**: Protection from infectious diseases
- **Parasite prevention**: Treatments against fleas and worms
- **Dental health**: Regular cleaning and monitoring
- **Mental health**: Love, attention, and social interaction

### 3. Hygiene and Health
- **Bathing**: As needed (every 4-6 weeks for dogs)
- **Ear cleaning**: Prevent infections
- **Nail trimming**: Avoid walking problems
- **Teeth cleaning**: Daily if possible
- **Place cleanliness**: Regular cleaning of home and bedding

### 4. Behavior and Training
- **Early training**: Start from young age
- **Positive reinforcement**: Use rewards
- **Patience and consistency**: Training takes time
- **Socialization**: Expose to different people and animals
- **Clear boundaries**: Teach what is acceptable

### 5. Safety and Protection
- **Rabies vaccination**: Legally required in most countries
- **Microchip**: Helps find lost pet
- **Pet insurance**: May help cover medical expenses
- **Supervision**: Don't leave pet alone for long periods
- **Safe environment**: Remove dangerous and toxic items
`
  },
  {
    id: 2,
    titleAr: "فهم سلوك حيوانك الأليف",
    titleEn: "Understanding Your Pet's Behavior",
    iconAr: "🧠",
    iconEn: "🧠",
    descriptionAr: "تعلم كيفية فهم ما يحاول حيوانك الأليف إخبارك به",
    descriptionEn: "Learn how to understand what your pet is trying to tell you",
    contentAr: `
## فهم سلوك حيوانك الأليف

### لغة جسد الكلب
**العلامات الإيجابية:**
- الذيل المرفوع والمتحرك: سعادة وثقة
- الأذنان المنتصبة: اهتمام وتركيز
- الفم المفتوح قليلاً: استرخاء وسعادة
- الجسم المنخفض قليلاً: لعب وحماس

**العلامات السلبية:**
- الذيل بين الأرجل: خوف أو قلق
- الأذنان المسطحة للخلف: خوف أو عدوانية
- الشعر المنتصب على الظهر: توتر أو عدوانية
- الهمس أو الزمجرة: تحذير

### لغة جسد القطة
**العلامات الإيجابية:**
- الذيل المرفوع: ثقة وسعادة
- الخرخرة: رضا وسعادة
- العيون الضيقة: حب وثقة
- رفع الرأس: ترحيب

**العلامات السلبية:**
- الذيل المنتفخ: خوف أو غضب
- الأذنان للخلف: غضب أو خوف
- الهسهسة أو الزمجرة: تحذير
- الانسحاب والاختباء: خوف أو مرض

### السلوكيات الشائعة وتفسيراتها
**الحفر والخدش:**
- قد يكون علامة على الملل أو القلق
- قد يكون محاولة للبحث عن شيء
- قد يكون سلوك طبيعي يحتاج تحويل

**العض واللدغ:**
- قد يكون لعب عند الصغار
- قد يكون خوف أو دفاع
- قد يكون ألم أو عدم ارتياح

**الأكل المفرط:**
- قد يكون ملل أو قلق
- قد يكون مشكلة طبية
- قد يكون عادة سيئة

### متى تطلب المساعدة
استشر الطبيب البيطري إذا:
- تغير السلوك فجأة
- ظهرت علامات عدوانية
- رفض الأكل أو الشرب
- أصبح الحيوان منعزلاً
- ظهرت علامات ألم أو تعب
`
  },
  {
    id: 3,
    titleAr: "التغذية والتنوع الغذائي",
    titleEn: "Nutrition and Dietary Variety",
    iconAr: "🥗",
    iconEn: "🥗",
    descriptionAr: "دليل شامل لتغذية صحية ومتوازنة",
    descriptionEn: "Comprehensive guide to healthy and balanced nutrition",
    contentAr: `
## التغذية والتنوع الغذائي

### العناصر الغذائية الأساسية
**البروتينات:**
- ضرورية لبناء العضلات والأنسجة
- الكلاب تحتاج 18-25% من السعرات الحرارية
- القطط تحتاج 25-30% من السعرات الحرارية

**الدهون:**
- مصدر الطاقة والفيتامينات الدهنية
- الكلاب تحتاج 5-15% من السعرات الحرارية
- القطط تحتاج 10-15% من السعرات الحرارية

**الكربوهيدرات:**
- مصدر الطاقة والألياف
- ليست ضرورية للقطط لكنها مفيدة للكلاب

**الفيتامينات والمعادن:**
- ضرورية للصحة العامة والمناعة
- الكالسيوم والفسفور للعظام
- الحديد والزنك للصحة العامة

### أنواع الطعام
**الطعام الجاف (Kibble):**
- مريح وسهل التخزين
- جيد لتنظيف الأسنان
- قد يحتوي على مواد حافظة

**الطعام الرطب:**
- أسهل للهضم
- محتوى ماء أعلى
- أكثر تكلفة

**الطعام المطبوخ في المنزل:**
- تحكم أكبر في المكونات
- يحتاج استشارة طبيب بيطري
- يحتاج وقت وجهد

**الطعام الخام:**
- قريب من الطبيعة
- قد يحتوي على بكتيريا ضارة
- يحتاج احتياطات صحية

### الأطعمة السامة التي يجب تجنبها
- **الشوكولاتة**: سامة للكلاب والقطط
- **العنب والزبيب**: قد تسبب فشل كلوي
- **البصل والثوم**: تدمر خلايا الدم الحمراء
- **الأفوكادو**: يحتوي على مادة سامة
- **المكاديميا**: سامة للكلاب
- **الكحول**: خطير جداً
- **الكافيين**: خطير جداً

### جدول التغذية
**الجراء:**
- 3-4 وجبات يومياً حتى 6 أشهر
- وجبتان يومياً من 6 أشهر إلى سنة
- وجبة أو وجبتان يومياً بعد سنة

**الكلاب البالغة:**
- وجبة أو وجبتان يومياً
- نفس الوقت كل يوم

**القطط:**
- 2-3 وجبات يومياً
- بعض القطط تفضل الأكل على مدار اليوم
`
  },
  {
    id: 4,
    titleAr: "الصحة العقلية والعاطفية",
    titleEn: "Mental and Emotional Health",
    iconAr: "❤️",
    iconEn: "❤️",
    descriptionAr: "أهمية الصحة العقلية والعاطفية لحيوانك الأليف",
    descriptionEn: "Importance of mental and emotional health for your pet",
    contentAr: `
## الصحة العقلية والعاطفية

### الحب والارتباط
- **الارتباط الآمن**: أساس الصحة العقلية
- **الوقت معاً**: اقضِ وقتاً نوعياً مع حيوانك
- **اللعب والتفاعل**: ضروري للسعادة
- **الحنان**: الملمس والمداعبة مهمة جداً

### الإثراء البيئي
**للكلاب:**
- ألعاب تفاعلية
- ألعاب الألغاز
- ألعاب المضغ الآمنة
- الألعاب التي تتحرك

**للقطط:**
- أعمدة التسلق
- الألعاب المتحركة
- الصناديق والأنفاق
- نوافذ المراقبة

### التمرين والنشاط
- **المشي اليومي**: ضروري للكلاب
- **اللعب التفاعلي**: مهم للقطط
- **تدريب الرشاقة**: تحدي عقلي
- **السباحة**: تمرين ممتاز منخفض التأثير

### التنشئة الاجتماعية
- **التعرض المبكر**: للأشخاص والحيوانات والأماكن
- **التجارب الإيجابية**: بناء الثقة
- **التعريض التدريجي**: للأشياء الجديدة
- **المجموعات الاجتماعية**: الحيوانات حيوانات اجتماعية

### علامات القلق والاكتئاب
- الانسحاب والعزلة
- فقدان الاهتمام باللعب
- تغيير في أنماط الأكل
- السلوك المدمر
- الخمول والكسل

### كيفية مساعدة حيوانك
- **قضاء وقت أكثر معه**: الحب والاهتمام
- **تغيير الروتين**: أشياء جديدة وممتعة
- **التمرين المنتظم**: يقلل التوتر
- **الاسترخاء**: خلق بيئة هادئة
- **استشارة الطبيب**: قد يكون هناك مشكلة طبية
`
  },
  {
    id: 5,
    titleAr: "الإسعافات الأولية والطوارئ",
    titleEn: "First Aid and Emergencies",
    iconAr: "🚑",
    iconEn: "🚑",
    descriptionAr: "ماذا تفعل في حالات الطوارئ",
    descriptionEn: "What to do in emergency situations",
    contentAr: `
## الإسعافات الأولية والطوارئ

### علامات الطوارئ
اتصل بالطبيب البيطري فوراً إذا:
- صعوبة في التنفس
- فقدان الوعي
- نزيف حاد
- عدم القدرة على الحركة
- القيء أو الإسهال المستمر
- عدم التبول لأكثر من 24 ساعة
- الألم الشديد
- النوبات أو الارتعاش

### الإسعافات الأولية الأساسية

**النزيف:**
1. اضغط على الجرح بقطعة قماش نظيفة
2. حافظ على الضغط لمدة 10-15 دقيقة
3. استخدم ضمادة ضاغطة
4. اذهب للطبيب البيطري فوراً

**الاختناق:**
1. حاول إزالة الجسم الغريب برفق
2. إذا لم تستطع، لا تحاول بقوة
3. اذهب للطبيب البيطري فوراً
4. قد تحتاج لعملية جراحية

**الحروق:**
1. برد المنطقة بماء بارد (ليس ثلج)
2. لا تضع مراهم
3. غطِ بضمادة نظيفة
4. اذهب للطبيب البيطري

**التسمم:**
1. حدد المادة السامة إن أمكن
2. لا تحاول تحريض القيء بدون استشارة
3. اتصل بمركز السموم أو الطبيب البيطري
4. احفظ عينة من المادة السامة

**الكسور:**
1. حاول تثبيت الطرف المصاب
2. لا تحاول تحريك الطرف
3. استخدم جبيرة مؤقتة إذا أمكن
4. اذهب للطبيب البيطري فوراً

### مجموعة الإسعافات الأولية
يجب أن تحتوي على:
- ضمادات معقمة
- شاش معقم
- شريط لاصق
- مطهر
- قفازات
- مقص
- ملقط
- ميزان حرارة
- أدوية موصى بها من الطبيب

### رقم الطبيب البيطري
احفظ أرقام:
- الطبيب البيطري العادي
- عيادة الطوارئ البيطرية
- مركز السموم
- الشرطة (في حالة الحيوان الضائع)
`
  }
];

export default function OwnerEducation() {
  const [isArabic, setIsArabic] = useState(true);
  const [selectedModule, setSelectedModule] = useState(0);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden ${isArabic ? "rtl" : "ltr"}`}>
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full backdrop-blur">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
              {isArabic ? "👨‍👩‍👧‍👦 تعليم أصحاب الحيوانات الأليفة" : "👨‍👩‍👧‍👦 Pet Owner Education"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent`}>
          {isArabic ? "📚 تعليم أصحاب الحيوانات" : "📚 Owner Education"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
          {isArabic
            ? "دليل شامل لأصحاب الحيوانات الأليفة الجدد والمتمرسين"
            : "Comprehensive guide for new and experienced pet owners"}
        </p>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(true)}
            className={isArabic ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            العربية
          </Button>
          <Button
            variant={!isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(false)}
            className={!isArabic ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            English
          </Button>
        </div>
      </div>

      {/* Module Selection */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {ownerEducationModules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => setSelectedModule(index)}
              className={`p-4 rounded-lg border transition-all ${
                selectedModule === index
                  ? "bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/20"
                  : "bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60"
              }`}
            >
              <div className="text-3xl mb-2">{module.iconAr}</div>
              <p className="text-sm font-semibold text-purple-300">
                {isArabic ? module.titleAr : module.titleEn}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Module Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 pb-12">
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="text-4xl">{ownerEducationModules[selectedModule].iconAr}</div>
              <div>
                <CardTitle className="text-purple-300 text-2xl">
                  {isArabic
                    ? ownerEducationModules[selectedModule].titleAr
                    : ownerEducationModules[selectedModule].titleEn}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isArabic
                    ? ownerEducationModules[selectedModule].descriptionAr
                    : ownerEducationModules[selectedModule].descriptionEn}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-slate-800/50 rounded-lg p-6 text-gray-300 prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {isArabic
                  ? ownerEducationModules[selectedModule].contentAr
                  : ownerEducationModules[selectedModule].contentEn}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Card className="bg-slate-900/50 border-purple-500/30 mt-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                {isArabic
                  ? "💡 هذه المعلومات تعليمية عامة. استشر الطبيب البيطري دائماً للحصول على نصيحة متخصصة."
                  : "💡 This information is general educational content. Always consult a veterinarian for specialized advice."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
