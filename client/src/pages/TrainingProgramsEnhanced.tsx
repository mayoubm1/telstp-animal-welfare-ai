import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, CheckCircle2, Clock3, ListChecks, Loader2, ShieldCheck, Stethoscope, Target } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProfessionalShell } from "@/components/ProfessionalShell";

type CurriculumStep = { step?: number; title?: string; description?: string };

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

function parseSteps(value: unknown): CurriculumStep[] {
  if (Array.isArray(value)) return value.filter((item): item is CurriculumStep => Boolean(item && typeof item === "object"));
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is CurriculumStep => Boolean(item && typeof item === "object")) : [];
  } catch {
    return [];
  }
}

const difficultyLabels = {
  beginner: { en: "Beginner", ar: "مبتدئ" },
  intermediate: { en: "Intermediate", ar: "متوسط" },
  advanced: { en: "Advanced", ar: "متقدم" },
};

export default function TrainingProgramsEnhanced() {
  const { isArabic } = useLanguage();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const { data: programs = [], isLoading, isError } = trpc.trainingPrograms.getAll.useQuery({ limit: 20 });

  const categories = useMemo(() => Array.from(new Set(programs.map((program) => program.category).filter(Boolean))), [programs]);
  const filteredPrograms = useMemo(
    () => category === "all" ? programs : programs.filter((program) => program.category === category),
    [category, programs]
  );
  const selectedProgram = filteredPrograms.find((program) => program.id === selectedId) || filteredPrograms[0];
  const steps = selectedProgram ? parseSteps(isArabic ? selectedProgram.stepsAr : selectedProgram.steps) : [];
  const tips = selectedProgram ? parseList(isArabic ? selectedProgram.tipsAr : selectedProgram.tips) : [];
  const successIndicators = selectedProgram ? parseList(isArabic ? selectedProgram.successIndicatorsAr : selectedProgram.successIndicators) : [];
  const difficulty = selectedProgram?.difficulty ? difficultyLabels[selectedProgram.difficulty as keyof typeof difficultyLabels] : undefined;

  const selectProgram = (id: number) => {
    setSelectedId(id);
    setCompletedSteps([]);
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <ProfessionalShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0c5660]"><BookOpenCheck className="h-5 w-5" aria-hidden="true" />{isArabic ? "أكاديمية التدريب" : "Training academy"}</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#12343b] sm:text-5xl">{isArabic ? "برامج تدريب منظمة يمكن تنفيذها" : "Training programs you can actually follow"}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{isArabic ? "يعرض كل برنامج دروساً خطوة بخطوة ونصائح عملية ومؤشرات نجاح قابلة للملاحظة حتى تنتقل من القراءة إلى ممارسة واضحة مع حيوانك." : "Every program exposes step-by-step lessons, practical tips, and observable success indicators so owners can move from reading to deliberate practice with their pet."}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register-pet" className="inline-flex items-center gap-2 rounded-lg bg-[#0c5660] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#08434b]"><Target className="h-4 w-4" aria-hidden="true" />{isArabic ? "سجل حيوانك أولاً" : "Register your pet first"}</Link>
            <span className="text-sm text-slate-500">{isArabic ? "المحتوى تعليمي ولا يستبدل التقييم البيطري." : "Educational content does not replace veterinary assessment."}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="self-start lg:sticky lg:top-28">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{isArabic ? "البرامج" : "Programs"}</h2><span className="text-xs text-slate-400">{filteredPrograms.length}</span></div>
          <div className="mb-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setCategory("all")} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${category === "all" ? "border-[#0c5660] bg-[#0c5660] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#0c5660]/40"}`}>{isArabic ? "الكل" : "All"}</button>
            {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${category === item ? "border-[#0c5660] bg-[#0c5660] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#0c5660]/40"}`}>{item.replaceAll("_", " ")}</button>)}
          </div>
          <div className="space-y-2">
            {filteredPrograms.map((program) => {
              const active = selectedProgram?.id === program.id;
              return <button type="button" key={program.id} onClick={() => selectProgram(program.id)} className={`w-full rounded-xl border p-4 text-start transition ${active ? "border-[#86bdb5] bg-[#edf7f5] shadow-sm" : "border-slate-200 bg-white hover:border-[#b9dcd6]"}`}><p className="font-semibold text-[#12343b]">{isArabic ? program.nameAr || program.name : program.name}</p><p className="mt-2 text-xs leading-5 text-slate-500">{isArabic ? program.descriptionAr || program.description : program.description}</p><div className="mt-3 flex items-center gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{program.duration ?? "—"} {isArabic ? "يوم" : "days"}</span></div></button>;
            })}
          </div>
        </aside>

        <div>
          {isLoading && <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white"><Loader2 className="h-7 w-7 animate-spin text-[#0c5660]" aria-label={isArabic ? "جاري التحميل" : "Loading"} /></div>}
          {isError && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800"><h2 className="font-semibold">{isArabic ? "تعذر تحميل البرامج" : "Training programs could not be loaded"}</h2><p className="mt-2 text-sm">{isArabic ? "تحقق من الاتصال بالخادم وحاول مرة أخرى." : "Check the server connection and try again."}</p></div>}
          {!isLoading && !isError && !selectedProgram && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><BookOpenCheck className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-semibold text-[#12343b]">{isArabic ? "لا توجد برامج في هذه الفئة" : "No programs in this category"}</h2><p className="mt-2 text-sm text-slate-500">{isArabic ? "اختر فئة أخرى لعرض المنهج المتاح." : "Choose another category to view the available curriculum."}</p></div>}

          {selectedProgram && <article className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5660]">{selectedProgram.category?.replaceAll("_", " ")}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#12343b]">{isArabic ? selectedProgram.nameAr || selectedProgram.name : selectedProgram.name}</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{isArabic ? selectedProgram.descriptionAr || selectedProgram.description : selectedProgram.description}</p></div>
                {difficulty && <span className="rounded-full border border-[#b9dcd6] bg-[#edf7f5] px-3 py-1.5 text-xs font-semibold text-[#0c5660]">{isArabic ? difficulty.ar : difficulty.en}</span>}
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><Clock3 className="h-4 w-4 text-[#0c5660]" aria-hidden="true" /><p className="mt-3 text-xs text-slate-500">{isArabic ? "المدة" : "Duration"}</p><p className="mt-1 font-semibold text-slate-800">{selectedProgram.duration ?? "—"} {isArabic ? "يوم" : "days"}</p></div><div className="rounded-xl bg-slate-50 p-4"><ListChecks className="h-4 w-4 text-[#0c5660]" aria-hidden="true" /><p className="mt-3 text-xs text-slate-500">{isArabic ? "الفئة العمرية" : "Age range"}</p><p className="mt-1 font-semibold text-slate-800">{selectedProgram.ageRange || "—"}</p></div><div className="rounded-xl bg-slate-50 p-4"><Stethoscope className="h-4 w-4 text-[#0c5660]" aria-hidden="true" /><p className="mt-3 text-xs text-slate-500">{isArabic ? "الخطوات المنشورة" : "Published steps"}</p><p className="mt-1 font-semibold text-slate-800">{steps.length || "—"}</p></div></div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5660]">{isArabic ? "المنهج خطوة بخطوة" : "Step-by-step curriculum"}</p><h3 className="mt-2 text-xl font-semibold text-[#12343b]">{isArabic ? "نفّذ وتابع" : "Practice and track"}</h3></div><span className="text-sm font-semibold text-[#0c5660]">{completedSteps.length}/{steps.length}</span></div><div className="mt-6 space-y-3">{steps.length ? steps.map((step, index) => { const complete = completedSteps.includes(index); return <button type="button" key={`${step.step ?? index}-${step.title ?? "step"}`} onClick={() => toggleStep(index)} className={`flex w-full gap-4 rounded-xl border p-4 text-start transition ${complete ? "border-[#8bc6bb] bg-[#edf7f5]" : "border-slate-200 hover:border-[#b9dcd6]"}`}><span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${complete ? "bg-[#0c5660] text-white" : "bg-slate-100 text-slate-600"}`}>{complete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : step.step ?? index + 1}</span><span><span className={`block font-semibold ${complete ? "text-[#0c5660]" : "text-slate-800"}`}>{step.title || (isArabic ? `الخطوة ${index + 1}` : `Step ${index + 1}`)}</span><span className="mt-1 block text-sm leading-6 text-slate-500">{step.description || "—"}</span></span></button>; }) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{isArabic ? "لم يتم نشر خطوات هذا البرنامج بعد." : "Step details have not been published for this program yet."}</p>}</div></section>

              <div className="space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-semibold text-[#12343b]">{isArabic ? "نصائح عملية" : "Practical tips"}</h3><ul className="mt-4 space-y-3">{tips.length ? tips.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#26704c]" aria-hidden="true" />{item}</li>) : <li className="text-sm text-slate-500">{isArabic ? "لم يتم نشر النصائح بعد." : "Practical tips are not published yet."}</li>}</ul></section><section className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-semibold text-[#12343b]">{isArabic ? "مؤشرات النجاح" : "Success indicators"}</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">{(successIndicators.length ? successIndicators : [isArabic ? "حدد مؤشراً واضحاً مع الطبيب أو المدرب" : "Set a clear indicator with your veterinarian or trainer"]).map((item) => <li key={item}>• {item}</li>)}</ul></section></div>
            </div>
          </article>}
        </div>
      </section>
    </ProfessionalShell>
  );
}
