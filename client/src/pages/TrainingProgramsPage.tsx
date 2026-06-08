import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Pause, CheckCircle, Zap } from "lucide-react";

const difficulties = [
  { id: "beginner", label: "مبتدئ", labelEn: "Beginner" },
  { id: "intermediate", label: "متوسط", labelEn: "Intermediate" },
  { id: "advanced", label: "متقدم", labelEn: "Advanced" },
];

const categories = [
  { id: "bathroom_training", label: "تدريب الحمام", labelEn: "Bathroom Training" },
  { id: "obedience", label: "الطاعة", labelEn: "Obedience" },
  { id: "play_socialization", label: "اللعب والتنشئة", labelEn: "Play & Socialization" },
  { id: "agility", label: "الرشاقة", labelEn: "Agility" },
  { id: "behavior", label: "السلوك", labelEn: "Behavior" },
];

export default function TrainingProgramsPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isArabic, setIsArabic] = useState(true);

  const { data: programs, isLoading } = trpc.trainingPrograms.getAll.useQuery({
    difficulty: (selectedDifficulty as any) || undefined,
    category: selectedCategory || undefined,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Mystical Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      {/* Header Hero Section */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full backdrop-blur">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className={`text-sm font-semibold ${isArabic ? "text-right" : ""}`}>
              {isArabic ? "🎓 برامج التدريب المتقدمة" : "🎓 Advanced Training Programs"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent ${isArabic ? "text-right" : ""}`}>
          {isArabic ? "🐾 أكاديمية التدريب السحرية" : "🐾 Mystical Training Academy"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-2xl mx-auto mb-8 ${isArabic ? "text-right" : ""}`}>
          {isArabic
            ? "تدرب حيوانك الأليف مع برامج متقدمة من تدريب الحمام إلى الطاعة والرشاقة"
            : "Train your pet with advanced programs from bathroom training to obedience and agility"}
        </p>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(true)}
            className={isArabic ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            العربية
          </Button>
          <Button
            variant={!isArabic ? "default" : "outline"}
            onClick={() => setIsArabic(false)}
            className={!isArabic ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            English
          </Button>
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-8">
        <div className={`mb-4 ${isArabic ? "text-right" : ""}`}>
          <p className="text-gray-400 font-semibold mb-2">
            {isArabic ? "مستوى الصعوبة:" : "Difficulty Level:"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedDifficulty === null ? "default" : "outline"}
            onClick={() => setSelectedDifficulty(null)}
            className={selectedDifficulty === null ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "border-yellow-500/50"}
          >
            {isArabic ? "الكل" : "All"}
          </Button>
          {difficulties.map((diff) => (
            <Button
              key={diff.id}
              variant={selectedDifficulty === diff.id ? "default" : "outline"}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={selectedDifficulty === diff.id ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "border-yellow-500/50"}
            >
              {isArabic ? diff.label : diff.labelEn}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-12">
        <div className={`mb-4 ${isArabic ? "text-right" : ""}`}>
          <p className="text-gray-400 font-semibold mb-2">
            {isArabic ? "الفئة:" : "Category:"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "border-yellow-500/50"}
          >
            {isArabic ? "الكل" : "All"}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "border-yellow-500/50"}
            >
              {isArabic ? cat.label : cat.labelEn}
            </Button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        ) : programs && programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card
                key={program.id}
                className="bg-slate-900/50 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 overflow-hidden group cursor-pointer backdrop-blur"
              >
                {/* Program Header */}
                <div className="relative h-40 bg-gradient-to-br from-yellow-900/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
                  <div className="text-5xl">🐾</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Program Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg text-yellow-300 mb-1 ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? program.nameAr || program.name : program.name}
                      </h3>
                      <p className={`text-sm text-gray-400 line-clamp-2 ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? program.descriptionAr || program.description : program.description}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Steps */}
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Zap className="w-4 h-4" />
                      <span>{program.durationDays || 30} {isArabic ? "يوم" : "days"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-purple-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>{program.totalSteps || 10} {isArabic ? "خطوة" : "steps"}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                      {difficulties.find((d) => d.id === program.difficulty)?.labelEn}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                      {categories.find((c) => c.id === program.category)?.labelEn}
                    </Badge>
                  </div>

                  {/* Key Points */}
                  {program.keyPoints && program.keyPoints.length > 0 && (
                    <div className="mb-3 p-2 bg-slate-800/50 rounded border border-yellow-500/20">
                      <p className="text-xs text-gray-400 font-semibold mb-1">
                        {isArabic ? "النقاط الرئيسية:" : "Key Points:"}
                      </p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {(program.keyPoints as string[]).slice(0, 2).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    <Play className="w-4 h-4 mr-2" />
                    {isArabic ? "ابدأ البرنامج" : "Start Program"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {isArabic ? "لم يتم العثور على برامج تدريب" : "No training programs found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
