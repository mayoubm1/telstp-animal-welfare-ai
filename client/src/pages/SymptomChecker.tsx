import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, Loader2, ShieldAlert, Stethoscope } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { ProfessionalShell } from "@/components/ProfessionalShell";
import { useLanguage } from "@/contexts/LanguageContext";

type Species = "cat" | "dog" | "";
type Severity = "mild" | "moderate" | "severe" | "";

export default function SymptomChecker() {
  const { isArabic } = useLanguage();
  const [species, setSpecies] = useState<Species>("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState<Severity>("moderate");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!species || !symptoms.trim() || !severity) {
      toast.error(isArabic ? "أكمل الحقول المطلوبة أولاً" : "Complete the required fields first");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/trpc/triage.assess", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ json: { species, symptoms: symptoms.trim(), severity } }) });
      const data = await response.json();
      if (data.result?.data) setResult(data.result.data);
      else toast.error(isArabic ? "تعذر الحصول على تقييم أولي" : "The initial assessment could not be completed");
    } catch (error: any) {
      toast.error(error?.message || (isArabic ? "حدث خطأ غير متوقع" : "An unexpected error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => { setResult(null); setSpecies(""); setSymptoms(""); setSeverity("moderate"); };
  const urgency = result?.triageLevel;
  const urgencyClass = urgency === "emergency" ? "border-red-200 bg-red-50 text-red-900" : urgency === "urgent" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-blue-200 bg-blue-50 text-blue-900";

  return (
    <ProfessionalShell>
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8"><div className="max-w-3xl"><div className="flex items-center gap-2 text-sm font-semibold text-[#0c5660]"><Stethoscope className="h-5 w-5" aria-hidden="true" />{isArabic ? "أدوات صحة الحيوان" : "Pet health tools"}</div><h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#12343b] sm:text-5xl">{isArabic ? "نظم الأعراض قبل التواصل مع الطبيب" : "Organize symptoms before you contact the veterinarian"}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{isArabic ? "أدخل السياق الأساسي للحصول على إرشاد أولي حول درجة الاستعجال والخطوة التالية. هذا ليس تشخيصاً ولا يستبدل الفحص البيطري." : "Capture the essential context for an initial urgency guide and next step. This is not a diagnosis and does not replace veterinary examination."}</p></div></div></section>
      <main className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 lg:grid-cols-[1fr_330px] lg:px-8">
        {!result ? <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8"><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5660]">{isArabic ? "الخطوة 1" : "Step 1"}</p><h2 className="mt-2 text-2xl font-semibold text-[#12343b]">{isArabic ? "صف ما تراه" : "Describe what you are seeing"}</h2></div><ClipboardList className="h-6 w-6 text-[#0c5660]" aria-hidden="true" /></div><div className="mt-7 space-y-7"><fieldset><legend className="text-sm font-semibold text-slate-800">{isArabic ? "نوع الحيوان" : "Pet species"}</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{(["cat", "dog"] as const).map((item) => <button type="button" key={item} onClick={() => setSpecies(item)} className={`rounded-xl border px-4 py-4 text-start transition ${species === item ? "border-[#0c5660] bg-[#edf7f5]" : "border-slate-200 hover:border-[#b9dcd6]"}`}><span className="block text-sm font-semibold text-[#12343b]">{item === "cat" ? (isArabic ? "قطة" : "Cat") : (isArabic ? "كلب" : "Dog")}</span><span className="mt-1 block text-xs text-slate-500">{isArabic ? "اختر النوع لتخصيص الإرشاد" : "Choose the species to frame the guidance"}</span></button>)}</div></fieldset><label className="block"><span className="text-sm font-semibold text-slate-800">{isArabic ? "الأعراض والمدة" : "Symptoms and timing"}</span><textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} className="mt-3 min-h-36 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7eb9b0] focus:ring-2 focus:ring-[#cfe8e4]" placeholder={isArabic ? "مثال: قيء وفقدان شهية منذ يومين..." : "Example: vomiting and reduced appetite for two days..."} /></label><fieldset><legend className="text-sm font-semibold text-slate-800">{isArabic ? "درجة القلق الحالية" : "Current concern level"}</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{(["mild", "moderate", "severe"] as const).map((level) => <button type="button" key={level} onClick={() => setSeverity(level)} className={`rounded-xl border px-3 py-3 text-sm font-semibold capitalize transition ${severity === level ? "border-[#0c5660] bg-[#edf7f5] text-[#0c5660]" : "border-slate-200 text-slate-600 hover:border-[#b9dcd6]"}`}>{isArabic ? ({ mild: "خفيف", moderate: "متوسط", severe: "شديد" }[level]) : level}</button>)}</div></fieldset><button type="submit" disabled={isLoading || !species || !symptoms.trim()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c5660] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#08434b] disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{isArabic ? "جاري التنظيم..." : "Organizing context..."}</> : <>{isArabic ? "احصل على الإرشاد الأولي" : "Get initial guidance"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></>}</button></div></form> : <div className="space-y-6"><div className="rounded-2xl border border-[#b9dcd6] bg-[#edf7f5] p-6"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0c5660] text-white"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5660]">{isArabic ? "الإرشاد الأولي" : "Initial guidance"}</p><h2 className="mt-2 text-2xl font-semibold text-[#12343b]">{isArabic ? "راجع النتيجة مع طبيب بيطري" : "Review this result with a veterinarian"}</h2></div></div></div>{urgency && <section className={`rounded-2xl border p-6 ${urgencyClass}`}><div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-[0.14em]">{isArabic ? "درجة الاستعجال" : "Urgency level"}</p><h3 className="mt-2 text-xl font-semibold capitalize">{urgency}</h3>{result.reasoning && <p className="mt-2 text-sm leading-6">{result.reasoning}</p>}</div></div></section>}{result.immediateActions?.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-semibold text-[#12343b]">{isArabic ? "الخطوات المقترحة" : "Suggested actions"}</h3><ul className="mt-4 space-y-3">{result.immediateActions.map((action: string) => <li key={action} className="flex gap-3 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#26704c]" aria-hidden="true" />{action}</li>)}</ul></section>}{result.whenToSeekHelp && <section className="rounded-2xl border border-red-200 bg-red-50 p-6"><div className="flex items-start gap-3 text-red-900"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><div><h3 className="font-semibold">{isArabic ? "متى تطلب الرعاية مباشرة" : "When to seek direct care"}</h3><p className="mt-2 text-sm leading-6">{result.whenToSeekHelp}</p></div></div></section>}<div className="flex flex-wrap gap-3"><button type="button" onClick={reset} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-[#86bdb5]">{isArabic ? "تقييم جديد" : "Start another assessment"}</button><Link href="/clinic-locator" className="inline-flex items-center gap-2 rounded-lg bg-[#0c5660] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#08434b]">{isArabic ? "اعثر على عيادة" : "Find a clinic"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></div>}
        <aside className="space-y-5"><div className="rounded-2xl border border-[#c5dfda] bg-[#edf7f5] p-6"><ShieldAlert className="h-5 w-5 text-[#0c5660]" aria-hidden="true" /><h2 className="mt-4 text-lg font-semibold text-[#12343b]">{isArabic ? "حدود مهمة" : "Important boundaries"}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{isArabic ? "صعوبة التنفس والانهيار والنزيف الشديد والاشتباه في التسمم حالات تستلزم الاتصال بالطوارئ البيطرية مباشرة." : "Breathing difficulty, collapse, severe bleeding, and suspected poisoning require direct veterinary or emergency care."}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold text-[#12343b]">{isArabic ? "ما يساعد الطبيب" : "What helps the veterinarian"}</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#26704c]" aria-hidden="true" />{isArabic ? "وقت بدء الأعراض" : "When the symptoms started"}</li><li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#26704c]" aria-hidden="true" />{isArabic ? "تغيرات الشهية والماء والإخراج" : "Changes in appetite, water, and elimination"}</li><li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#26704c]" aria-hidden="true" />{isArabic ? "الأدوية أو المنتجات الجديدة" : "New medications or products"}</li></ul></div></aside>
      </main>
    </ProfessionalShell>
  );
}
