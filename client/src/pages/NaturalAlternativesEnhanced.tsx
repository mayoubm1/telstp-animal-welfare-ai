import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Filter, ShoppingCart, Star } from "lucide-react";
import { ProductPopup } from "@/components/ProductPopup";
import { trpc } from "@/lib/trpc";

export default function NaturalAlternativesEnhanced() {
  const [isArabic, setIsArabic] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating" | "delivery">("rating");
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [selectedProductHandle, setSelectedProductHandle] = useState<string | undefined>();

  // Fetch categories and certifications
  const { data: categories = [] } = trpc.ai.naturalAlternatives.categories.useQuery();
  const { data: certifications = [] } = trpc.ai.naturalAlternatives.certifications.useQuery();

  // Fetch products with filters
  const { data: products = [] } = trpc.ai.naturalAlternatives.search.useQuery({
    query: searchQuery,
    filters: {
      categories: selectedCategory ? [selectedCategory] : undefined,
      certifications: selectedCertifications.length > 0 ? selectedCertifications : undefined,
      maxPrice: maxPrice || undefined,
      sortBy,
    },
  });

  const handleProductClick = (handle?: string) => {
    setSelectedProductHandle(handle);
    setShowProductPopup(true);
  };

  const toggleCertification = (cert: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  return (
    <>
      <ProductPopup
        isOpen={showProductPopup}
        onClose={() => setShowProductPopup(false)}
        productHandle={selectedProductHandle}
        context="landing"
      />

      <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 relative overflow-hidden ${isArabic ? "rtl" : "ltr"}`}>
        {/* Mystical Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header */}
        <div className="relative z-10 pt-12 pb-8 px-4 text-center">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full backdrop-blur">
              <Leaf className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-300">
                {isArabic ? "🌿 البدائل الطبيعية" : "🌿 Natural Alternatives"}
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent">
            {isArabic ? "🌿 البدائل الطبيعية" : "🌿 Natural Alternatives"}
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {isArabic
              ? "منتجات طبيعية وآمنة من مصادر موثوقة مع مقارنة الأسعار والجودة"
              : "Natural and safe products from trusted sources with price and quality comparison"}
          </p>

          {/* Language Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={isArabic ? "default" : "outline"}
              onClick={() => setIsArabic(true)}
              className={isArabic ? "bg-green-600 hover:bg-green-700" : ""}
            >
              العربية
            </Button>
            <Button
              variant={!isArabic ? "default" : "outline"}
              onClick={() => setIsArabic(false)}
              className={!isArabic ? "bg-green-600 hover:bg-green-700" : ""}
            >
              English
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 mb-12">
          <div className="bg-slate-900/50 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            {/* Search */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder={isArabic ? "ابحث عن المنتجات..." : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border-green-500/30 text-green-100 placeholder-green-300/50"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-semibold text-green-300 mb-2 block">
                  {isArabic ? "الفئة" : "Category"}
                </label>
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full bg-slate-800 border border-green-500/30 text-green-100 rounded-lg p-2"
                >
                  <option value="">{isArabic ? "الكل" : "All"}</option>
                  {categories.map((cat: any) => (
                    <option key={cat.value} value={cat.value}>
                      {isArabic ? cat.labelAr : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-sm font-semibold text-green-300 mb-2 block">
                  {isArabic ? "السعر الأقصى (EGP)" : "Max Price (EGP)"}
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  value={maxPrice || ""}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                  className="bg-slate-800 border-green-500/30 text-green-100"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-semibold text-green-300 mb-2 block">
                  {isArabic ? "ترتيب حسب" : "Sort By"}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-800 border border-green-500/30 text-green-100 rounded-lg p-2"
                >
                  <option value="rating">{isArabic ? "التقييم" : "Rating"}</option>
                  <option value="price-asc">{isArabic ? "السعر: الأقل أولاً" : "Price: Low to High"}</option>
                  <option value="price-desc">{isArabic ? "السعر: الأعلى أولاً" : "Price: High to Low"}</option>
                  <option value="delivery">{isArabic ? "سرعة التسليم" : "Delivery Speed"}</option>
                </select>
              </div>

              {/* Certifications */}
              <div>
                <label className="text-sm font-semibold text-green-300 mb-2 block">
                  {isArabic ? "الشهادات" : "Certifications"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {certifications.slice(0, 2).map((cert: any) => (
                    <button
                      key={cert.value}
                      onClick={() => toggleCertification(cert.value)}
                      className={`px-2 py-1 text-xs rounded-full transition-all ${
                        selectedCertifications.includes(cert.value)
                          ? "bg-green-500 text-slate-950 font-bold"
                          : "bg-green-500/20 text-green-300 border border-green-500/50"
                      }`}
                    >
                      {isArabic ? cert.labelAr : cert.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <Card
                key={product.id}
                className="bg-slate-900/50 border-green-500/30 hover:border-green-500/60 transition-all cursor-pointer group"
                onClick={() => handleProductClick(product.shopifyHandle)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-green-300 group-hover:text-green-200 transition-colors">
                        {isArabic ? product.titleAr : product.titleEn}
                      </CardTitle>
                      <CardDescription className="text-green-100/60">
                        {product.source === "shopify" && "🛍️ Shopify"}
                        {product.source === "amazon" && "📦 Amazon"}
                        {product.source === "chewy" && "🐾 Chewy"}
                        {product.source === "alibaba" && "🌏 Alibaba"}
                        {product.source === "local" && "🏪 Local"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-300">{product.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-400">{product.price}</span>
                    <span className="text-green-300">{product.currency}</span>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-1">
                    {product.certifications.slice(0, 3).map((cert: string) => (
                      <span
                        key={cert}
                        className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* Delivery & Availability */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-100/60">
                      {isArabic ? "التسليم:" : "Delivery:"} {product.deliveryDays} {isArabic ? "أيام" : "days"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.availability === "in-stock"
                          ? "bg-green-500/20 text-green-300"
                          : product.availability === "pre-order"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {product.availability === "in-stock" && (isArabic ? "متوفر" : "In Stock")}
                      {product.availability === "pre-order" && (isArabic ? "طلب مسبق" : "Pre-order")}
                      {product.availability === "out-of-stock" && (isArabic ? "غير متوفر" : "Out of Stock")}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.shopifyHandle);
                    }}
                    className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-green-400/50"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isArabic ? "أضف إلى السلة" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
              <p className="text-green-100/60 text-lg">
                {isArabic ? "لم يتم العثور على منتجات" : "No products found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
