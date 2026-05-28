import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Award, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  { id: "nutrition", label: "التغذية", labelEn: "Nutrition" },
  { id: "behavior", label: "السلوك", labelEn: "Behavior" },
  { id: "health", label: "الصحة", labelEn: "Health" },
  { id: "training", label: "التدريب", labelEn: "Training" },
  { id: "grooming", label: "العناية", labelEn: "Grooming" },
  { id: "socialization", label: "التنشئة", labelEn: "Socialization" },
];

export default function BestPracticesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isArabic, setIsArabic] = useState(true);

  const { data: practices, isLoading } = trpc.bestPractices.getAll.useQuery({
    category: selectedCategory || undefined,
    expertReview: true,
    limit: 20,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPractices = practices?.filter((p) =>
    searchQuery === ""
      ? true
      : p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.titleAr && p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Mystical Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      {/* Header Hero Section */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full backdrop-blur">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className={`text-sm font-semibold ${isArabic ? "text-right" : ""}`}>
              {isArabic ? "📚 أفضل الممارسات العالمية" : "📚 Global Best Practices"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent ${isArabic ? "text-right" : ""}`}>
          {isArabic ? "🏆 مركز التعليم والخبرة" : "🏆 Education & Expertise Hub"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-2xl mx-auto mb-8 ${isArabic ? "text-right" : ""}`}>
          {isArabic
            ? "تعلم أفضل الممارسات العالمية من الخبراء والمتخصصين في رعاية الحيوانات الأليفة"
            : "Learn global best practices from experts and specialists in pet care"}
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

      {/* Search Bar */}
      <div className="relative z-20 max-w-2xl mx-auto px-4 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
          <Input
            placeholder={isArabic ? "ابحث عن الممارسات..." : "Search practices..."}
            value={searchQuery}
            onChange={handleSearch}
            className="pl-12 py-3 bg-slate-900/50 border-yellow-500/30 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
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

      {/* Practices Grid */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        ) : filteredPractices && filteredPractices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPractices.map((practice) => (
              <Card
                key={practice.id}
                className="bg-slate-900/50 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 overflow-hidden group cursor-pointer backdrop-blur hover:shadow-lg hover:shadow-yellow-500/20"
              >
                {/* Practice Header */}
                <div className="relative p-6 bg-gradient-to-r from-yellow-900/20 to-purple-900/20 border-b border-yellow-500/20">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">📖</div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-xl text-yellow-300 mb-1 ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? practice.titleAr || practice.title : practice.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                          {categories.find((c) => c.id === practice.category)?.labelEn}
                        </Badge>
                        {practice.expertReview && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/50 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {isArabic ? "معتمد" : "Expert"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practice Content */}
                <div className="p-6">
                  <p className={`text-gray-300 mb-4 line-clamp-3 ${isArabic ? "text-right" : ""}`}>
                    {isArabic ? practice.contentAr || practice.content : practice.content}
                  </p>

                  {/* Key Points */}
                  {practice.keyPoints && practice.keyPoints.length > 0 && (
                    <div className="mb-4 p-3 bg-slate-800/50 rounded border border-yellow-500/20">
                      <p className={`text-sm font-semibold text-yellow-300 mb-2 ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? "النقاط الرئيسية:" : "Key Points:"}
                      </p>
                      <ul className={`text-sm text-gray-300 space-y-1 ${isArabic ? "text-right" : ""}`}>
                        {(practice.keyPoints as string[]).slice(0, 3).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-yellow-400 flex-shrink-0">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Source & Reviewer */}
                  <div className="flex items-center justify-between pt-3 border-t border-yellow-500/20 text-xs text-gray-400">
                    {practice.source && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {practice.source}
                      </span>
                    )}
                    {practice.reviewedBy && (
                      <span className="text-yellow-400">
                        {isArabic ? "مراجع:" : "Reviewed by:"} {practice.reviewedBy}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {isArabic ? "اقرأ المزيد" : "Read More"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {isArabic ? "لم يتم العثور على ممارسات" : "No practices found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
