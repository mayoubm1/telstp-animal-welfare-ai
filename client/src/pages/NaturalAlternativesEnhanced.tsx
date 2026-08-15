import { useMemo, useState } from "react";
import { Leaf, PackageCheck, Search, ShoppingBag, Sparkles, Wrench } from "lucide-react";
import { ProductPopup } from "@/components/ProductPopup";
import { ProfessionalShell } from "@/components/ProfessionalShell";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryIcons = {
  food: PackageCheck,
  supplement: Sparkles,
  treat: Leaf,
  accessory: Wrench,
  toy: Sparkles,
};

export default function NaturalAlternativesEnhanced() {
  const { isArabic } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating" | "delivery">("price-asc");
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [selectedProductHandle, setSelectedProductHandle] = useState<string | undefined>();

  const { data: categories = [] } = trpc.ai.naturalAlternatives.categories.useQuery();
  const { data: certifications = [] } = trpc.ai.naturalAlternatives.certifications.useQuery();
  const { data: products = [], isLoading } = trpc.ai.naturalAlternatives.search.useQuery({
    query,
    filters: {
      categories: selectedCategory ? [selectedCategory] : undefined,
      certifications: selectedCertifications.length ? selectedCertifications : undefined,
      maxPrice: maxPrice || undefined,
      sortBy,
    },
  });

  const displayedProducts = useMemo(() => products, [products]);
  const openStorefront = (handle?: string) => {
    if (!handle) return;
    setSelectedProductHandle(handle);
    setShowProductPopup(true);
  };
  const toggleCertification = (certification: string) => setSelectedCertifications((current) => current.includes(certification) ? current.filter((item) => item !== certification) : [...current, certification]);

  return (
    <ProfessionalShell>
      <ProductPopup isOpen={showProductPopup} onClose={() => setShowProductPopup(false)} productHandle={selectedProductHandle} context="landing" />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8">
          <div className="max-w-3xl"><div className="flex items-center gap-2 text-sm font-semibold text-[#26704c]"><Leaf className="h-5 w-5" aria-hidden="true" />{isArabic ? "دليل المنتجات" : "Care product directory"}</div><h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#12343b] sm:text-5xl">{isArabic ? "بدائل طبيعية واحتياجات رعاية واضحة" : "Natural alternatives with clear product context"}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{isArabic ? "قارن الفئات والمصدر والتوفر والسعر. كل بطاقة تحافظ على هوية المنتج ولا تستخدم صورة من منتج آخر." : "Compare category, source, availability, and price. Each card keeps its own product identity and never borrows an image from another item."}</p></div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500"><span className="rounded-full border border-[#c5dfda] bg-[#edf7f5] px-3 py-1.5 text-[#26704c]">{isArabic ? "بدون تقييمات مصطنعة" : "No fabricated ratings"}</span><span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{isArabic ? "توفر حسب المصدر" : "Availability by source"}</span><span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{isArabic ? "افحص الملاءمة مع الطبيب" : "Confirm suitability with your veterinarian"}</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isArabic ? "ابحث في الطعام والمكملات وأدوات التدريب..." : "Search food, supplements, training tools..."} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 ps-10 pe-4 text-sm text-slate-800 outline-none focus:border-[#7eb9b0] focus:ring-2 focus:ring-[#cfe8e4]" /></div><div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr]"><label className="text-xs font-semibold text-slate-500">{isArabic ? "الفئة" : "Category"}<select value={selectedCategory || ""} onChange={(event) => setSelectedCategory(event.target.value || null)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700"><option value="">{isArabic ? "كل الفئات" : "All categories"}</option>{categories.map((category) => <option key={category.value} value={category.value}>{isArabic ? category.labelAr : category.labelEn}</option>)}</select></label><label className="text-xs font-semibold text-slate-500">{isArabic ? "السعر الأقصى" : "Maximum price"}<input type="number" min="0" value={maxPrice ?? ""} onChange={(event) => setMaxPrice(event.target.value ? Number(event.target.value) : null)} placeholder="EGP" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700" /></label><label className="text-xs font-semibold text-slate-500">{isArabic ? "الترتيب" : "Sort"}<select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700"><option value="price-asc">{isArabic ? "السعر: الأقل" : "Price: low to high"}</option><option value="price-desc">{isArabic ? "السعر: الأعلى" : "Price: high to low"}</option><option value="delivery">{isArabic ? "سرعة التوصيل" : "Delivery speed"}</option></select></label><div><p className="text-xs font-semibold text-slate-500">{isArabic ? "الشهادات" : "Certifications"}</p><div className="mt-2 flex flex-wrap gap-2">{certifications.slice(0, 4).map((certification) => <button type="button" key={certification.value} onClick={() => toggleCertification(certification.value)} className={`rounded-full border px-2.5 py-1.5 text-xs font-medium ${selectedCertifications.includes(certification.value) ? "border-[#26704c] bg-[#26704c] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#86bdb5]"}`}>{isArabic ? certification.labelAr : certification.labelEn}</button>)}</div></div></div></div>

        <div className="mt-10 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#26704c]">{isArabic ? "الكتالوج" : "Catalog"}</p><h2 className="mt-2 text-2xl font-semibold text-[#12343b]">{isArabic ? "منتجات حسب الاستخدام" : "Products by use"}</h2></div><p className="text-sm text-slate-500">{displayedProducts.length} {isArabic ? "منتج" : "products"}</p></div>

        {isLoading ? <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">{isArabic ? "جاري تحميل المنتجات..." : "Loading products..."}</div> : <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{displayedProducts.map((product) => { const Icon = categoryIcons[product.category as keyof typeof categoryIcons] || PackageCheck; return <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#b9dcd6] hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]"><div className="flex h-44 items-center justify-center border-b border-slate-100 bg-[#f3f7f7]">{product.image ? <img src={product.image} alt={isArabic ? product.titleAr : product.titleEn} className="h-full w-full object-cover" /> : <div className="flex flex-col items-center gap-3 text-[#26704c]"><Icon className="h-10 w-10" aria-hidden="true" /><span className="text-xs font-medium text-slate-500">{isArabic ? "لا توجد صورة مصدرية" : "No source image supplied"}</span></div>}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#26704c]">{product.category}</p><h3 className="mt-2 text-lg font-semibold text-[#12343b]">{isArabic ? product.titleAr : product.titleEn}</h3></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{product.quality}</span></div><p className="mt-3 min-h-[3rem] text-sm leading-6 text-slate-600">{isArabic ? product.descriptionAr : product.descriptionEn}</p><div className="mt-4 flex flex-wrap gap-2">{product.certifications.slice(0, 3).map((certification) => <span key={certification} className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500">{certification}</span>)}</div><div className="mt-5 flex items-end justify-between gap-4"><div><p className="text-2xl font-semibold text-[#12343b]">{product.price} <span className="text-sm font-medium text-slate-500">{product.currency}</span></p><p className="mt-1 text-xs text-slate-500">{isArabic ? "المصدر:" : "Source:"} {product.source} · {product.deliveryDays} {isArabic ? "أيام" : "days"}</p></div>{product.shopifyHandle ? <button type="button" onClick={() => openStorefront(product.shopifyHandle)} className="inline-flex items-center gap-2 rounded-lg bg-[#0c5660] px-3 py-2 text-xs font-semibold text-white hover:bg-[#08434b]"><ShoppingBag className="h-4 w-4" aria-hidden="true" />{isArabic ? "عرض المنتج" : "View product"}</button> : <span className="max-w-[110px] text-end text-[0.68rem] leading-4 text-slate-400">{isArabic ? "لا يوجد متجر متصل لهذا المصدر" : "No connected storefront for this source"}</span>}</div></div></article>; })}</div>}

        {!isLoading && displayedProducts.length === 0 && <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center"><Leaf className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-semibold text-[#12343b]">{isArabic ? "لا توجد منتجات مطابقة" : "No matching products"}</h2><p className="mt-2 text-sm text-slate-500">{isArabic ? "غيّر الفلاتر أو ابحث بكلمة أخرى." : "Change the filters or search for another term."}</p></div>}
      </section>
    </ProfessionalShell>
  );
}
