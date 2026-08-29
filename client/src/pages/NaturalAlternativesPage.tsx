import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Star, ShoppingCart } from "lucide-react";

const categories = [
  { id: "organic_food", label: "الغذاء العضوي", labelEn: "Organic Food" },
  { id: "natural_treats", label: "الحلويات الطبيعية", labelEn: "Natural Treats" },
  { id: "eco_supplies", label: "المستلزمات البيئية", labelEn: "Eco Supplies" },
  { id: "toys_enrichment", label: "الألعاب والإثراء", labelEn: "Toys & Enrichment" },
  { id: "grooming", label: "العناية والتجميل", labelEn: "Grooming" },
  { id: "training_tools", label: "أدوات التدريب", labelEn: "Training Tools" },
  { id: "supplements", label: "المكملات", labelEn: "Supplements" },
  { id: "bedding", label: "الفراش", labelEn: "Bedding" },
];

export default function NaturalAlternativesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isArabic, setIsArabic] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const { data: alternatives, isLoading } = trpc.naturalAlternatives.getAll.useQuery({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    verified: true,
    limit: 20,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Mystical Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      {/* Header Hero Section */}
      <div className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full backdrop-blur">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className={`text-sm font-semibold ${isArabic ? "text-right" : ""}`}>
              {isArabic ? "✨ البدائل الطبيعية المعتمدة" : "✨ Verified Natural Alternatives"}
            </span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent ${isArabic ? "text-right" : ""}`}>
          {isArabic ? "🌿 البدائل الطبيعية" : "🌿 Natural Alternatives"}
        </h1>

        <p className={`text-xl text-gray-300 max-w-2xl mx-auto mb-8 ${isArabic ? "text-right" : ""}`}>
          {isArabic
            ? "اكتشف أفضل المنتجات الطبيعية والآمنة لحيوانك الأليف من الغذاء العضوي إلى الألعاب البيئية"
            : "Discover the best natural and safe products for your pet from organic food to eco-friendly toys"}
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
            placeholder={isArabic ? "ابحث عن المنتجات..." : "Search products..."}
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

      {/* Products Grid */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        ) : alternatives && alternatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map((alt) => (
              <Card
                key={alt.id}
                className="bg-slate-900/50 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 overflow-hidden group cursor-pointer backdrop-blur"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-yellow-900/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
                  {alt.imageUrl ? (
                    <img
                      src={alt.imageUrl}
                      alt={isArabic ? alt.nameAr || alt.name : alt.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-4xl">🌿</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg text-yellow-300 mb-1 ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? alt.nameAr || alt.name : alt.name}
                      </h3>
                      <p className={`text-sm text-gray-400 ${isArabic ? "text-right" : ""}`}>
                        {isArabic ? alt.descriptionAr || alt.description : alt.description}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(typeof alt.rating === 'string' ? parseFloat(alt.rating) : (alt.rating || 0)) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">({alt.reviewCount || 0})</span>
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                      {isArabic
                        ? categories.find((c) => c.id === alt.category)?.label
                        : categories.find((c) => c.id === alt.category)?.labelEn}
                    </Badge>
                    {alt.verified && <Badge className="bg-green-500/20 text-green-300 border-green-500/50">✓ {isArabic ? "معتمد" : "Verified"}</Badge>}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-yellow-500/20">
                    {alt.price && (
                      <span className="text-lg font-bold text-yellow-400">
                        {typeof alt.price === 'string' ? parseFloat(alt.price).toFixed(2) : (alt.price as any)?.toFixed?.(2) || '0.00'} {isArabic ? 'ج.م' : 'EGP'}
                      </span>
                    )}
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black ml-auto"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {isArabic ? "اشتري" : "Buy"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {isArabic ? "لم يتم العثور على منتجات" : "No products found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
