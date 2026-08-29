import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, CheckCircle, Zap } from "lucide-react";

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
    category: (selectedCategory as string | undefined) || undefined,
    limit: 20,
  });

  const filteredPrograms = selectedDifficulty
    ? programs?.filter((p) => p.difficulty === selectedDifficulty)
    : programs;

  const getDifficultyLabel = (id: string | null | undefined) => {
    if (!id) return "Level";
    return difficulties.find((d) => d.id === id)?.[isArabic ? "label" : "labelEn"] || id;
  };

  const getCategoryLabel = (id: string | null | undefined) => {
    if (!id) return "Category";
    return categories.find((c) => c.id === id)?.[isArabic ? "label" : "labelEn"] || id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-2">
          {isArabic ? "أكاديمية التدريب" : "Training Academy"}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {isArabic ? "برامج تدريب شاملة لحيوانك الأليف" : "Comprehensive training programs for your pet"}
        </p>
      </div>

      {/* Filters */}
      <div className="relative z-10 px-4 mb-8 flex gap-4 flex-wrap justify-center">
        <Button
          onClick={() => setIsArabic(!isArabic)}
          className="bg-purple-500/50 hover:bg-purple-500/70 border border-purple-400/50"
        >
          {isArabic ? "English" : "العربية"}
        </Button>
      </div>

      {/* Programs Grid */}
      <div className="relative z-10 px-4 pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          </div>
        ) : filteredPrograms && filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredPrograms.map((program) => (
              <Card
                key={program.id}
                className="bg-slate-900/50 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">
                    {isArabic ? program.nameAr : program.name}
                  </h3>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {isArabic ? program.descriptionAr : program.description}
                  </p>

                  {/* Duration & Steps */}
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Zap className="w-4 h-4" />
                      <span>{program.duration || 30} {isArabic ? "يوم" : "days"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-purple-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>{program.duration || 10} {isArabic ? "خطوة" : "steps"}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
                      {getDifficultyLabel(program.difficulty)}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/50">
                      {getCategoryLabel(program.category)}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold">
                    <Play className="w-4 h-4 mr-2" />
                    {isArabic ? "ابدأ البرنامج" : "Start Program"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">{isArabic ? "لا توجد برامج متاحة" : "No programs available"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
