import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  ClipboardCheck,
  HeartPulse,
  Leaf,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { ProfessionalShell } from "@/components/ProfessionalShell";
import { useLanguage } from "@/contexts/LanguageContext";

const pathways = [
  {
    href: "/ai-diagnosis",
    icon: Brain,
    tone: "teal",
    en: { title: "AI-assisted triage", description: "Organize symptoms, images, and urgency before you call a veterinarian." },
    ar: { title: "الفرز المساعد بالذكاء الاصطناعي", description: "نظم الأعراض والصور ودرجة الاستعجال قبل التواصل مع الطبيب البيطري." },
  },
  {
    href: "/clinic-locator",
    icon: MapPin,
    tone: "blue",
    en: { title: "Find the right clinic", description: "Search an Egypt-ready directory with emergency and specialty filters." },
    ar: { title: "اعثر على العيادة المناسبة", description: "ابحث في دليل مهيأ لمصر مع فلاتر الطوارئ والتخصصات." },
  },
  {
    href: "/case-history",
    icon: ClipboardCheck,
    tone: "slate",
    en: { title: "Keep a usable health record", description: "Bring symptoms, history, and follow-up notes into one shareable view." },
    ar: { title: "احتفظ بسجل صحي عملي", description: "اجمع الأعراض والتاريخ وملاحظات المتابعة في عرض واحد قابل للمشاركة." },
  },
  {
    href: "/education-enhanced",
    icon: BookOpen,
    tone: "indigo",
    en: { title: "Learn from structured guidance", description: "Read prevention, nutrition, emergency, and life-stage guidance in Arabic or English." },
    ar: { title: "تعلم من إرشادات منظمة", description: "اقرأ إرشادات الوقاية والتغذية والطوارئ ومراحل العمر بالعربية أو الإنجليزية." },
  },
  {
    href: "/training-programs",
    icon: CalendarCheck,
    tone: "amber",
    en: { title: "Follow a real training pathway", description: "Use step-by-step lessons, practical tips, and observable success indicators—not just headlines." },
    ar: { title: "اتبع مساراً تدريبياً حقيقياً", description: "استخدم الدروس خطوة بخطوة والنصائح العملية ومؤشرات النجاح، وليس العناوين فقط." },
  },
  {
    href: "/natural-alternatives",
    icon: Leaf,
    tone: "emerald",
    en: { title: "Compare care products responsibly", description: "Review category, availability, and product details without confusing food, toys, or tools." },
    ar: { title: "قارن منتجات الرعاية بمسؤولية", description: "راجع الفئة والتوفر والتفاصيل دون خلط الطعام بالألعاب أو أدوات التدريب." },
  },
];

const toneClasses: Record<string, string> = {
  teal: "bg-[#e6f3f1] text-[#0c5660]",
  blue: "bg-[#eaf1fb] text-[#285b9f]",
  slate: "bg-slate-100 text-slate-700",
  indigo: "bg-[#eef0fb] text-[#4d5ca8]",
  amber: "bg-[#fbf2df] text-[#95651a]",
  emerald: "bg-[#e8f4ed] text-[#26704c]",
};

export default function HomeV3() {
  const { isArabic } = useLanguage();

  return (
    <ProfessionalShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-20">
          <div className={isArabic ? "lg:order-2" : ""}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b9dcd6] bg-[#f1f9f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#0c5660]">
              <HeartPulse className="h-4 w-4" aria-hidden="true" />
              {isArabic ? "تواصل لعلوم الحياة" : "Tawasol Life Sciences"}
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#12343b] sm:text-5xl lg:text-6xl">
              {isArabic ? "رعاية بيطرية عملية تبدأ من بيتك" : "Practical veterinary care that starts at home"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {isArabic
                ? "تيلستب يساعد أصحاب الحيوانات والأطباء البيطريين على تنظيم الأعراض، الوصول إلى العيادات، متابعة السجل الصحي، والتعلم من إرشادات واضحة."
                : "TELSTP helps pet owners and veterinarians organize symptoms, reach clinics, maintain health records, and learn from clear guidance."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-[#0c5660] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#08434b]">
                {isArabic ? "افتح مساحة الرعاية" : "Open care workspace"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/clinic-locator" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0c5660]/40 hover:text-[#0c5660]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {isArabic ? "اعثر على عيادة" : "Find a clinic"}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#0c5660]" aria-hidden="true" />{isArabic ? "إرشاد آمن" : "Safety-first guidance"}</span>
              <span className="inline-flex items-center gap-2"><Stethoscope className="h-4 w-4 text-[#0c5660]" aria-hidden="true" />{isArabic ? "مصمم للأطباء والأسر" : "Built for clinicians and families"}</span>
            </div>
          </div>

          <div className={`relative ${isArabic ? "lg:order-1" : ""}`}>
            <div className="absolute -inset-4 rounded-[2rem] bg-[#dcefeb] blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[1.4rem] border border-[#b9dcd6] bg-[#edf5f4] p-5 shadow-[0_22px_60px_rgba(18,52,59,0.12)] sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-[#cfe8e4] pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0c5660]">{isArabic ? "مساحة تسليم الرعاية" : "Care handoff workspace"}</p>
                  <h2 className="mt-2 text-xl font-semibold text-[#12343b]">{isArabic ? "من الملاحظة إلى الخطوة التالية" : "From observation to the next safe step"}</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0c5660] shadow-sm"><HeartPulse className="h-5 w-5" aria-hidden="true" /></span>
              </div>
              <div className="relative mt-6 space-y-4">
                <div className="absolute start-[15px] top-6 bottom-6 w-px bg-[#b9dcd6]" aria-hidden="true" />
                {[
                  { label: isArabic ? "سجل الملاحظة" : "Record the observation", detail: isArabic ? "الأعراض، المدة، والصور عند الحاجة" : "Symptoms, timing, and images when useful", icon: Stethoscope },
                  { label: isArabic ? "افهم مستوى الاستعجال" : "Understand urgency", detail: isArabic ? "إرشاد أولي مع حدود واضحة للتصعيد" : "Initial guidance with clear escalation boundaries", icon: ShieldCheck },
                  { label: isArabic ? "تواصل مع الطبيب" : "Reach the veterinarian", detail: isArabic ? "سجل منظم يمكن مشاركته في العيادة" : "Organized context to carry into the clinic", icon: MapPin },
                ].map(({ label, detail, icon: Icon }) => (
                  <div key={label} className="relative flex items-start gap-4 rounded-xl border border-white bg-white/80 p-4 shadow-sm">
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0c5660] text-white"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                    <div><p className="text-sm font-semibold text-[#12343b]">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-[#c5dfda] bg-white/70 p-4 text-xs leading-5 text-slate-600"><span className="font-semibold text-[#0c5660]">{isArabic ? "مبدأ المنصة: " : "Platform principle: "}</span>{isArabic ? "الذكاء الاصطناعي يساعد، والطبيب البيطري يقرر." : "AI assists; the veterinarian decides."}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8 lg:py-18">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0c5660]">{isArabic ? "مسارات الرعاية" : "Care pathways"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#12343b]">{isArabic ? "كل ما يحتاجه صاحب الحيوان في مكان واضح" : "The essential owner workflows, in one clear place"}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{isArabic ? "اختر المسار المناسب الآن، ثم احتفظ بالسياق الصحي للخطوة التالية." : "Choose the right path now, then carry the health context into the next step."}</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pathways.map((pathway) => {
            const Icon = pathway.icon;
            const copy = isArabic ? pathway.ar : pathway.en;
            return (
              <Link key={pathway.href} href={pathway.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#9bcac3] hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[pathway.tone]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-5 text-lg font-semibold text-[#12343b]">{copy.title}</h3>
                <p className="mt-2 min-h-[3.5rem] text-sm leading-6 text-slate-600">{copy.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0c5660]">{isArabic ? "افتح المسار" : "Open pathway"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#edf5f4]">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-14 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-[#c5dfda] bg-white p-7">
            <div className="flex items-center gap-3"><HeartPulse className="h-5 w-5 text-[#0c5660]" aria-hidden="true" /><h2 className="text-xl font-semibold text-[#12343b]">{isArabic ? "لأصحاب الحيوانات" : "For pet owners"}</h2></div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{isArabic ? "ابدأ بملف حيوان واضح، افهم متى تحتاج إلى طوارئ، واستعد ببيانات مفيدة قبل زيارة الطبيب." : "Start with a clear pet profile, understand when care is urgent, and arrive at the clinic with useful context."}</p>
            <Link href="/register-pet" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0c5660]">{isArabic ? "سجل حيوانك" : "Register a pet"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="rounded-2xl border border-[#c5dfda] bg-[#12343b] p-7 text-white">
            <div className="flex items-center gap-3"><Stethoscope className="h-5 w-5 text-[#a8d8ce]" aria-hidden="true" /><h2 className="text-xl font-semibold">{isArabic ? "للأطباء والعيادات" : "For veterinarians and clinics"}</h2></div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{isArabic ? "اعرض تخصصك، نظم الطلبات، وشارك في شبكة رعاية أكثر وضوحاً لأصحاب الحيوانات في مصر." : "Present your specialty, manage requests, and participate in a clearer care network for pet owners across Egypt."}</p>
            <Link href="/vet-registration" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a8d8ce]">{isArabic ? "افتح بوابة الطبيب" : "Open veterinarian portal"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8 lg:py-18">
        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0c5660]">{isArabic ? "مبدأ المنصة" : "Platform principle"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#12343b]">{isArabic ? "الذكاء الاصطناعي يساعد. الطبيب يقرر." : "AI assists. Veterinarians decide."}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, en: "Clear escalation", ar: "تصعيد واضح", copyEn: "Emergency flows point owners toward human care.", copyAr: "مسارات الطوارئ توجه صاحب الحيوان إلى الرعاية البشرية." },
              { icon: Syringe, en: "Preventive care", ar: "رعاية وقائية", copyEn: "Education supports vaccination, nutrition, and follow-up.", copyAr: "التعليم يدعم التطعيم والتغذية والمتابعة." },
              { icon: Stethoscope, en: "Clinical context", ar: "سياق سريري", copyEn: "Records and history are designed to be useful at the clinic.", copyAr: "السجلات والتاريخ مصممان ليكونا مفيدين في العيادة." },
            ].map((item) => {
              const Icon = item.icon;
              return <div key={item.en} className="rounded-xl border border-slate-200 bg-white p-5"><Icon className="h-5 w-5 text-[#0c5660]" aria-hidden="true" /><h3 className="mt-4 text-sm font-semibold text-slate-800">{isArabic ? item.ar : item.en}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{isArabic ? item.copyAr : item.copyEn}</p></div>;
            })}
          </div>
        </div>
      </section>
    </ProfessionalShell>
  );
}
