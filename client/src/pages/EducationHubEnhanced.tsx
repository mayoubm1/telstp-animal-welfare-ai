import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Zap, Award } from "lucide-react";

const courses = [
  {
    id: 1,
    titleAr: "أساسيات الطب البيطري للمالكين",
    titleEn: "Veterinary Basics for Owners",
    descriptionAr: "فهم أساسي للصحة البيطرية والرعاية الوقائية",
    descriptionEn: "Basic understanding of veterinary health and preventive care",
    lessonsAr: [
      "ما هو الطبيب البيطري وماذا يفعل",
      "الفحوصات الدورية والتطعيمات",
      "الوقاية من الأمراض الشائعة",
      "متى تطلب المساعدة الطبية"
    ],
    lessonsEn: [
      "What is a veterinarian and what they do",
      "Regular checkups and vaccinations",
      "Prevention of common diseases",
      "When to seek medical help"
    ],
    durationAr: "4 أسابيع",
    durationEn: "4 weeks",
    levelAr: "مبتدئ",
    levelEn: "Beginner"
  },
  {
    id: 2,
    titleAr: "التدريب السلوكي المتقدم",
    titleEn: "Advanced Behavioral Training",
    descriptionAr: "تقنيات متقدمة لتدريب الحيوانات الأليفة",
    descriptionEn: "Advanced techniques for pet training",
    lessonsAr: [
      "أساسيات علم السلوك الحيواني",
      "التعزيز الإيجابي والسلبي",
      "حل المشاكل السلوكية",
      "التدريب المتقدم والحيل"
    ],
    lessonsEn: [
      "Basics of animal behavior science",
      "Positive and negative reinforcement",
      "Solving behavioral problems",
      "Advanced training and tricks"
    ],
    durationAr: "6 أسابيع",
    durationEn: "6 weeks",
    levelAr: "متوسط",
    levelEn: "Intermediate"
  },
  {
    id: 3,
    titleAr: "التغذية المتقدمة والنظم الغذائية",
    titleEn: "Advanced Nutrition and Diets",
    descriptionAr: "فهم عميق لاحتياجات التغذية المختلفة",
    descriptionEn: "Deep understanding of different nutritional needs",
    lessonsAr: [
      "العناصر الغذائية الأساسية",
      "الحميات الخاصة والطبية",
      "قراءة ملصقات الطعام",
      "التغذية حسب العمر والحالة الصحية"
    ],
    lessonsEn: [
      "Essential nutrients",
      "Special and medical diets",
      "Reading food labels",
      "Nutrition by age and health status"
    ],
    durationAr: "5 أسابيع",
    durationEn: "5 weeks",
    levelAr: "متقدم",
    levelEn: "Advanced"
  },
  {
    id: 4,
    titleAr: "الإسعافات الأولية والطوارئ",
    titleEn: "First Aid and Emergency Response",
    descriptionAr: "كيفية التعامل مع حالات الطوارئ",
    descriptionEn: "How to handle emergency situations",
    lessonsAr: [
      "تقييم الحالات الطارئة",
      "الإسعافات الأولية الأساسية",
      "الإنعاش القلبي الرئوي",
      "الاستعداد للطوارئ"
    ],
    lessonsEn: [
      "Assessing emergency situations",
      "Basic first aid",
      "CPR and rescue breathing",
      "Emergency preparedness"
    ],
    durationAr: "3 أسابيع",
    durationEn: "3 weeks",
    levelAr: "مبتدئ",
    levelEn: "Beginner"
  }
];

export default function EducationHubEnhanced() {
  const [isArabic, setIsArabic] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  const course = courses[selectedCourse];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden ${isArabic ? "rtl" : "ltr"}`}>
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full backdrop-blur">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">
              {isArabic ? "📚 مركز التعليم" : "📚 Education Hub"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent`}>
          {isArabic ? "📚 مركز التعليم" : "📚 Education Hub"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
          {isArabic
            ? "دورات تعليمية شاملة لأصحاب الحيوانات الأليفة"
            : "Comprehensive educational courses for pet owners"}
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

      {/* Course Selection */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((c, index) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(index)}
              className={`p-4 rounded-lg border transition-all ${
                selectedCourse === index
                  ? "bg-blue-600/30 border-blue-500 shadow-lg shadow-blue-500/20"
                  : "bg-slate-900/50 border-blue-500/30 hover:border-blue-500/60"
              }`}
            >
              <p className="text-sm font-semibold text-blue-300">
                {isArabic ? c.titleAr : c.titleEn}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {isArabic ? c.durationAr : c.durationEn}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Course Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 pb-12">
        <Card className="bg-slate-900/50 border-blue-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-300 text-3xl">
              {isArabic ? course.titleAr : course.titleEn}
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              {isArabic ? course.descriptionAr : course.descriptionEn}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⏱️</div>
                <p className="text-sm text-gray-400">{isArabic ? "المدة" : "Duration"}</p>
                <p className="font-semibold text-blue-300">{isArabic ? course.durationAr : course.durationEn}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm text-gray-400">{isArabic ? "المستوى" : "Level"}</p>
                <p className="font-semibold text-blue-300">{isArabic ? course.levelAr : course.levelEn}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm text-gray-400">{isArabic ? "الدروس" : "Lessons"}</p>
                <p className="font-semibold text-blue-300">{(isArabic ? course.lessonsAr : course.lessonsEn).length}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">
                {isArabic ? "📖 محتوى الدورة" : "📖 Course Content"}
              </h3>

              <div className="space-y-3">
                {(isArabic ? course.lessonsAr : course.lessonsEn).map((lesson, index) => (
                  <button
                    key={index}
                    onClick={() => setExpandedLesson(expandedLesson === index ? null : index)}
                    className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all border border-blue-500/20 hover:border-blue-500/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-semibold text-blue-300">
                          {index + 1}
                        </div>
                        <span className="text-gray-300">{lesson}</span>
                      </div>
                      <span className="text-blue-400">{expandedLesson === index ? "−" : "+"}</span>
                    </div>

                    {expandedLesson === index && (
                      <div className="mt-4 ml-11 pt-4 border-t border-blue-500/20 text-sm text-gray-400">
                        {isArabic
                          ? `هذا الدرس يغطي المفاهيم الأساسية والتطبيقات العملية لـ "${lesson}". ستتعلم كيفية تطبيق هذه المعرفة في حياتك اليومية مع حيوانك الأليف.`
                          : `This lesson covers the basic concepts and practical applications of "${lesson}". You will learn how to apply this knowledge in your daily life with your pet.`}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Card */}
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="font-semibold text-gray-300">
                    {isArabic ? "ابدأ هذه الدورة اليوم" : "Start this course today"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isArabic ? "احصل على شهادة عند الانتهاء" : "Get a certificate upon completion"}
                  </p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {isArabic ? "التسجيل الآن" : "Enroll Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
