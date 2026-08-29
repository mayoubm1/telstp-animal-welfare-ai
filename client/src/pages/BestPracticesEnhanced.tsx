import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, ExternalLink, Search, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProfessionalShell } from "@/components/ProfessionalShell";

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return value.split("\n").map((item) => item.replace(/^[-•✓\s]+/, "").trim()).filter(Boolean);
  }
}

const categories = ["all", "nutrition", "behavior", "health", "grooming", "training", "enrichment", "socialization", "emergency_care"];

export default function BestPracticesEnhanced() {
  const { isArabic } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: articles = [], isLoading, isError } = trpc.bestPractices.getAll.useQuery({ limit: 50, offset: 0 });

  const filteredArticles = useMemo(() => articles.filter((article) => {
    const haystack = [article.title, article.titleAr, article.content, article.contentAr, article.source].filter(Boolean).join(" ").toLowerCase();
    return (category === "all" || article.category === category) && haystack.includes(query.toLowerCase());
  }), [articles, category, query]);
  const selectedArticle = filteredArticles.find((article) => article.id === selectedId) || filteredArticles[0];
  const keyPoints = selectedArticle ? parseList(isArabic ? selectedArticle.keyPointsAr : selectedArticle.keyPoints) : [];
  const references = selectedArticle ? parseList(selectedArticle.references) : [];
  const species = selectedArticle ? parseList(selectedArticle.species) : [];

  return (
    <ProfessionalShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0c5660]"><BookOpen className="h-5 w-5" aria-hidden="true" />{isArabic ? "مكتبة المعرفة" : "Knowledge library"}</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#12343b] sm:text-5xl">{isArabic ? "أفضل الممارسات لرعاية أكثر أماناً" : "Best practices for safer everyday care"}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{isArabic ? "إرشادات منظمة في التغذية والسلوك والوقاية والطوارئ، مع مصدر واضح وسياق يساعدك على اتخاذ الخطوة التالية مع طبيبك." : "Structured guidance across nutrition, behavior, prevention, and emergencies—with clear sources and context for the next conversation with your veterinarian."}</p>
          </div>
          <div className="relative mt-8 max-w-2xl"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 ps-10 pe-4 text-sm text-slate-800 outline-none transition focus:border-[#7eb9b0] focus:ring-2 focus:ring-[#cfe8e4]" placeholder={isArabic ? "ابحث في العناوين والمصادر والمحتوى..." : "Search titles, sources, and guidance..."} /></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="self-start lg:sticky lg:top-28"><h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{isArabic ? "الموضوع" : "Topic"}</h2><div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-lg border px-3 py-2 text-start text-xs font-semibold capitalize transition ${category === item ? "border-[#0c5660] bg-[#0c5660] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#86bdb5]"}`}>{item.replaceAll("_", " ")}</button>)}</div><div className="mt-8 rounded-xl border border-[#c5dfda] bg-[#edf7f5] p-4"><ShieldCheck className="h-5 w-5 text-[#0c5660]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold text-[#12343b]">{isArabic ? "استخدم المعلومات بأمان" : "Use information safely"}</p><p className="mt-2 text-xs leading-5 text-slate-600">{isArabic ? "المحتوى تعليمي. الأعراض الخطيرة تحتاج إلى تقييم بيطري مباشر." : "This library is educational. Serious symptoms need direct veterinary assessment."}</p></div></aside>

        <div>
          {isLoading && <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">{isArabic ? "جاري تحميل الإرشادات..." : "Loading guidance..."}</div>}
          {isError && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800"><h2 className="font-semibold">{isArabic ? "تعذر تحميل المكتبة" : "The knowledge library could not be loaded"}</h2><p className="mt-2 text-sm">{isArabic ? "تحقق من اتصال الخادم ثم أعد المحاولة." : "Check the server connection and try again."}</p></div>}
          {!isLoading && !isError && !selectedArticle && <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center"><BookOpen className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-semibold text-[#12343b]">{isArabic ? "لا توجد إرشادات مطابقة" : "No matching guidance"}</h2><p className="mt-2 text-sm text-slate-500">{isArabic ? "غيّر البحث أو الموضوع لعرض المحتوى المتاح." : "Change the search or topic to view available content."}</p></div>}

          {selectedArticle && <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">{filteredArticles.map((article) => { const active = article.id === selectedArticle.id; return <button type="button" key={article.id} onClick={() => setSelectedId(article.id)} className={`w-full rounded-xl border p-4 text-start transition ${active ? "border-[#86bdb5] bg-[#edf7f5] shadow-sm" : "border-slate-200 bg-white hover:border-[#b9dcd6]"}`}><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0c5660]">{article.category.replaceAll("_", " ")}</p><h2 className="mt-2 font-semibold text-[#12343b]">{isArabic ? article.titleAr || article.title : article.title}</h2><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{isArabic ? article.contentAr || article.content : article.content}</p>{article.expertReview && <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#26704c]"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />{isArabic ? "مراجعة خبيرة" : "Expert reviewed"}</span>}</button>; })}</div>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5660]">{selectedArticle.category.replaceAll("_", " ")}</p><h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#12343b]">{isArabic ? selectedArticle.titleAr || selectedArticle.title : selectedArticle.title}</h2></div>{selectedArticle.expertReview && <span className="inline-flex items-center gap-2 rounded-full border border-[#b9dcd6] bg-[#edf7f5] px-3 py-1.5 text-xs font-semibold text-[#26704c]"><ShieldCheck className="h-4 w-4" aria-hidden="true" />{isArabic ? "تمت مراجعته" : "Reviewed"}</span>}</div><div className="mt-7 whitespace-pre-line text-base leading-8 text-slate-700">{isArabic ? selectedArticle.contentAr || selectedArticle.content : selectedArticle.content}</div>{keyPoints.length > 0 && <section className="mt-8 rounded-xl bg-[#f3f7f7] p-5"><h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0c5660]">{isArabic ? "النقاط الأساسية" : "Key points"}</h3><ul className="mt-4 grid gap-3 sm:grid-cols-2">{keyPoints.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#26704c]" aria-hidden="true" />{item}</li>)}</ul></section>}<div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{isArabic ? "المصدر" : "Source"}</p><p className="mt-2 text-sm font-medium text-slate-700">{selectedArticle.source || (isArabic ? "غير محدد" : "Not specified")}</p>{selectedArticle.reviewedBy && <p className="mt-1 text-xs text-slate-500">{isArabic ? "راجعها: " : "Reviewed by: "}{selectedArticle.reviewedBy}</p>}</div><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{isArabic ? "مناسب لـ" : "Applicable to"}</p><p className="mt-2 text-sm text-slate-700">{species.length ? species.join(isArabic ? "، " : ", ") : (isArabic ? "الحيوانات الأليفة" : "Companion animals")}</p></div></div>{references.length > 0 && <div className="mt-6 border-t border-slate-200 pt-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{isArabic ? "مراجع إضافية" : "Further references"}</p><div className="mt-3 grid gap-2">{references.map((reference) => <a key={reference} href={reference} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[#0c5660] hover:underline"><ExternalLink className="h-4 w-4" aria-hidden="true" />{reference}</a>)}</div></div>}</article>
          </div>}
        </div>
      </section>
    </ProfessionalShell>
  );
}
