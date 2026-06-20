import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, Trophy, ShoppingBag } from "lucide-react";
import { ProductPopup } from "@/components/ProductPopup";

const programs = [
  {
    id: 1,
    titleAr: "تدريب الطاعة الأساسي",
    titleEn: "Basic Obedience Training",
    descriptionAr: "تعليم الأوامر الأساسية والطاعة",
    descriptionEn: "Teaching basic commands and obedience",
    exercisesAr: [
      "الجلوس (Sit)",
      "البقاء (Stay)",
      "الاستدعاء (Come)",
      "المشي بهدوء (Heel)"
    ],
    exercisesEn: [
      "Sit",
      "Stay",
      "Come",
      "Heel"
    ],
    durationAr: "4 أسابيع",
    durationEn: "4 weeks",
    frequencyAr: "3 مرات أسبوعياً",
    frequencyEn: "3 times per week",
    difficultyAr: "مبتدئ",
    difficultyEn: "Beginner"
  },
  {
    id: 2,
    titleAr: "تدريب الحيل المتقدمة",
    titleEn: "Advanced Tricks Training",
    descriptionAr: "تعليم حيل متقدمة وممتعة",
    descriptionEn: "Teaching advanced and fun tricks",
    exercisesAr: [
      "الدوران (Spin)",
      "اللعب الميت (Play Dead)",
      "القفز (Jump)",
      "الزحف (Crawl)"
    ],
    exercisesEn: [
      "Spin",
      "Play Dead",
      "Jump",
      "Crawl"
    ],
    durationAr: "6 أسابيع",
    durationEn: "6 weeks",
    frequencyAr: "4 مرات أسبوعياً",
    frequencyEn: "4 times per week",
    difficultyAr: "متوسط",
    difficultyEn: "Intermediate"
  },
  {
    id: 3,
    titleAr: "تدريب الرياضة والرشاقة",
    titleEn: "Agility and Sport Training",
    descriptionAr: "تطوير اللياقة البدنية والرشاقة",
    descriptionEn: "Developing fitness and agility",
    exercisesAr: [
      "القفز فوق الحواجز",
      "المسارات المتعرجة",
      "الأنفاق",
      "الأنشطة المتقدمة"
    ],
    exercisesEn: [
      "Jumping obstacles",
      "Weave poles",
      "Tunnels",
      "Advanced activities"
    ],
    durationAr: "8 أسابيع",
    durationEn: "8 weeks",
    frequencyAr: "5 مرات أسبوعياً",
    frequencyEn: "5 times per week",
    difficultyAr: "متقدم",
    difficultyEn: "Advanced"
  },
  {
    id: 4,
    titleAr: "تدريب حل المشاكل السلوكية",
    titleEn: "Behavioral Problem Solving",
    descriptionAr: "معالجة المشاكل السلوكية الشائعة",
    descriptionEn: "Addressing common behavioral issues",
    exercisesAr: [
      "التعامل مع العدوانية",
      "القلق والخوف",
      "السلوك المدمر",
      "مشاكل النظافة"
    ],
    exercisesEn: [
      "Aggression management",
      "Anxiety and fear",
      "Destructive behavior",
      "Housebreaking issues"
    ],
    durationAr: "10 أسابيع",
    durationEn: "10 weeks",
    frequencyAr: "يومي",
    frequencyEn: "Daily",
    difficultyAr: "متقدم",
    difficultyEn: "Advanced"
  }
];

export default function TrainingProgramsEnhanced() {
  const [isArabic, setIsArabic] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [showProductPopup, setShowProductPopup] = useState(false);

  const program = programs[selectedProgram];

  const toggleExercise = (index: number) => {
    setCompletedExercises(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const progressPercentage = Math.round(
    (completedExercises.length / (isArabic ? program.exercisesAr : program.exercisesEn).length) * 100
  );

  return (
    <>
      <ProductPopup
        isOpen={showProductPopup}
        onClose={() => setShowProductPopup(false)}
        context="training"
      />
      <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden ${isArabic ? "rtl" : "ltr"}`}>
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full backdrop-blur">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
              {isArabic ? "🏆 برامج التدريب" : "🏆 Training Programs"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent`}>
          {isArabic ? "🏆 برامج التدريب" : "🏆 Training Programs"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-3xl mx-auto mb-8`}>
          {isArabic
            ? "برامج تدريب شاملة لتطوير مهارات حيوانك الأليف"
            : "Comprehensive training programs to develop your pet's skills"}
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
          <Button
            onClick={() => setShowProductPopup(true)}
            className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-amber-400/50"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {isArabic ? "🛍️ احصل على المعدات" : "🛍️ Get Equipment"}
          </Button>
        </div>
      </div>

      {/* Program Selection */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {programs.map((p, index) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProgram(index);
                setCompletedExercises([]);
              }}
              className={`p-4 rounded-lg border transition-all ${
                selectedProgram === index
                  ? "bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/20"
                  : "bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60"
              }`}
            >
              <p className="text-sm font-semibold text-purple-300">
                {isArabic ? p.titleAr : p.titleEn}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {isArabic ? p.durationAr : p.durationEn}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Program Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 pb-12">
        <Card className="bg-slate-900/50 border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 text-3xl">
              {isArabic ? program.titleAr : program.titleEn}
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              {isArabic ? program.descriptionAr : program.descriptionEn}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⏱️</div>
                <p className="text-sm text-gray-400">{isArabic ? "المدة" : "Duration"}</p>
                <p className="font-semibold text-purple-300">{isArabic ? program.durationAr : program.durationEn}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-sm text-gray-400">{isArabic ? "التكرار" : "Frequency"}</p>
                <p className="font-semibold text-purple-300">{isArabic ? program.frequencyAr : program.frequencyEn}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm text-gray-400">{isArabic ? "المستوى" : "Level"}</p>
                <p className="font-semibold text-purple-300">{isArabic ? program.difficultyAr : program.difficultyEn}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-semibold text-purple-300">
                  {isArabic ? "التقدم" : "Progress"}
                </p>
                <p className="text-sm text-gray-400">{progressPercentage}%</p>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Exercises */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">
                {isArabic ? "🎯 التمارين" : "🎯 Exercises"}
              </h3>

              <div className="space-y-3">
                {(isArabic ? program.exercisesAr : program.exercisesEn).map((exercise, index) => (
                  <button
                    key={index}
                    onClick={() => toggleExercise(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all border ${
                      completedExercises.includes(index)
                        ? "bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/10"
                        : "bg-slate-700/50 border-purple-500/20 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          completedExercises.includes(index)
                            ? "bg-purple-600 border-purple-400"
                            : "border-purple-400"
                        }`}>
                          {completedExercises.includes(index) && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </div>
                        <span className={`${completedExercises.includes(index) ? "line-through text-gray-400" : "text-gray-300"}`}>
                          {exercise}
                        </span>
                      </div>
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Trophy className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-300 mb-2">
                  {isArabic ? "💡 نصائح للنجاح" : "💡 Tips for Success"}
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• {isArabic ? "تدرب بانتظام وبصبر" : "Train regularly and patiently"}</li>
                  <li>• {isArabic ? "استخدم المكافآت والتعزيز الإيجابي" : "Use rewards and positive reinforcement"}</li>
                  <li>• {isArabic ? "جلسات قصيرة ومركزة أفضل من الطويلة" : "Short focused sessions are better than long ones"}</li>
                  <li>• {isArabic ? "احتفل بكل نجاح صغير" : "Celebrate every small success"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}
