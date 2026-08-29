import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  ClipboardCheck,
  HeartPulse,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { ProfessionalShell } from "@/components/ProfessionalShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { frameworkCardMotionClasses, toggleFrameworkPrinciple } from "@/lib/frameworkInteraction";

const gatewayImage = "/manus-storage/paws-purpose-gateway_c5b4e99a.jpg";

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
    en: { title: "Explore natural living carefully", description: "Compare real care categories responsibly without confusing food, toys, and wellbeing tools." },
    ar: { title: "استكشف الحياة الطبيعية بعناية", description: "قارن فئات الرعاية الحقيقية بمسؤولية دون خلط الطعام بالألعاب وأدوات الرفاه." },
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
  const [activePrinciple, setActivePrinciple] = useState<string | null>(null);
  const frameworkPrinciples = [
    {
      icon: HeartPulse,
      en: { title: "Care begins with attention", copy: "Animal welfare starts with the everyday relationship: observing, nourishing, playing, and acting with care.", practice: "In practice: record what changes, when it began, and what helps your animal feel safe." },
      ar: { title: "الرعاية تبدأ بالانتباه", copy: "رفاه الحيوان يبدأ من العلاقة اليومية: الملاحظة والتغذية واللعب والتصرف بعناية.", practice: "في الممارسة: سجل ما تغير ومتى بدأ وما يساعد حيوانك على الشعور بالأمان." },
    },
    {
      icon: Sparkles,
      en: { title: "Knowledge becomes shared practice", copy: "TELSTP connects care experience, veterinary expertise, education, and technology as a living laboratory for better decisions.", practice: "In practice: bring a structured care history into every conversation with a veterinarian." },
      ar: { title: "المعرفة تصبح ممارسة مشتركة", copy: "يربط تيلستب تجربة الرعاية والخبرة البيطرية والتعليم والتقنية كمختبر حي لقرارات أفضل.", practice: "في الممارسة: اصطحب تاريخ رعاية منظماً إلى كل تواصل مع الطبيب البيطري." },
    },
    {
      icon: ShieldCheck,
      en: { title: "Technology serves the greater good", copy: "AI can organize context and guide the next step; qualified veterinary professionals remain responsible for clinical decisions.", practice: "In practice: use guidance to prepare—not to replace examination, diagnosis, or veterinary judgment." },
      ar: { title: "التقنية تخدم الخير المشترك", copy: "يمكن للذكاء الاصطناعي تنظيم السياق وتوجيه الخطوة التالية؛ ويبقى القرار السريري بيد المختصين البيطريين.", practice: "في الممارسة: استخدم الإرشاد للاستعداد لا لاستبدال الفحص أو التشخيص أو الحكم البيطري." },
    },
  ];

  return (
    <ProfessionalShell>
      <section className="relative isolate overflow-hidden border-b border-[#1d3318] bg-[#071109] text-white">
        <div className="paws-gateway-media absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${gatewayImage})` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,9,5,0.93)_0%,rgba(4,9,5,0.72)_38%,rgba(4,9,5,0.3)_72%,rgba(4,9,5,0.68)_100%)]" aria-hidden="true" />
        <div className="paws-gateway-vignette absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgba(245,194,72,0.22),transparent_24%),radial-gradient(circle_at_15%_83%,rgba(101,172,71,0.18),transparent_28%)]" aria-hidden="true" />
        <div className="paws-gateway-embers absolute inset-0 opacity-60" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <div className="relative mx-auto flex min-h-[650px] max-w-[1440px] items-end px-5 py-14 sm:items-center lg:px-8 lg:py-20">
          <div className={`max-w-2xl ${isArabic ? "lg:mr-auto" : ""}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d5be7c]/50 bg-[#0b170b]/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#f5dfa1] backdrop-blur-sm">
              <Leaf className="h-4 w-4" aria-hidden="true" />
              {isArabic ? "بوابة رعاية حية" : "A living care gateway"}
            </div>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#d9e59f]">Paws &amp; Purpose</p>
            <h1 className="mt-3 max-w-xl text-5xl font-semibold leading-[0.98] tracking-tight text-[#fff9e8] sm:text-6xl lg:text-7xl">
              {isArabic ? "من المحبة اليومية إلى رعاية واعية" : "From everyday love to informed care"}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#e4e8d5]">
              {isArabic
                ? "حياة الحيوان تبدأ بالدفء والاهتمام. وعندما تحتاج الرعاية إلى معرفة وخطوة تالية واضحة، تقودك تيلستب إلى مساحة سريرية أكثر أماناً."
                : "A pet’s life begins with warmth and attention. When care calls for knowledge and a clear next step, TELSTP leads you into a safer clinical workspace."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#care-workspace" className="inline-flex items-center gap-2 rounded-lg bg-[#e5c76c] px-5 py-3 text-sm font-semibold text-[#17200e] shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition hover:bg-[#f4dd92]">
                {isArabic ? "ادخل مساحة الرعاية" : "Enter the care workspace"}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/natural-alternatives" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[#e5c76c]/70 hover:bg-black/35">
                <Leaf className="h-4 w-4" aria-hidden="true" />
                {isArabic ? "استكشف الحياة الطبيعية" : "Explore natural living"}
              </Link>
            </div>
            <p className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium tracking-wide text-[#d2dab5]"><span>{isArabic ? "غذِّ · العب · اعتنِ · أحب" : "Nourish · Play · Care · Love"}</span><span className="hidden sm:inline">•</span><span>{isArabic ? "رعاية مسؤولة، لا وعود تجارية" : "Responsible care, not catalogue claims"}</span></p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c5dfda] bg-[#edf5f4]">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0c5660]">{isArabic ? "إطار تيلستب لعلوم الحياة" : "The TELSTP Life Science Framework"}</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight text-[#12343b]">{isArabic ? "رحلة واحدة من العالم الحي إلى قرار رعاية مسؤول" : "One journey: from the living world to responsible care"}</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {frameworkPrinciples.map(({ icon: Icon, en, ar }) => {
              const copy = isArabic ? ar : en;
              const isActive = activePrinciple === en.title;
              return <button key={en.title} type="button" aria-pressed={isActive} onClick={() => setActivePrinciple(toggleFrameworkPrinciple(activePrinciple, en.title))} className={`group relative overflow-hidden rounded-xl border bg-white/80 p-5 text-start hover:border-[#6fa89f] hover:bg-white hover:shadow-[0_16px_32px_rgba(12,86,96,0.13)] focus-visible:border-[#0c5660] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c5660]/30 ${frameworkCardMotionClasses} ${isActive ? "border-[#0c5660] bg-white shadow-[0_16px_32px_rgba(12,86,96,0.13)]" : "border-[#c5dfda]"}`}><span className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#cce9e3] opacity-0 motion-safe:transition-opacity motion-safe:duration-200 group-hover:opacity-70 group-focus-visible:opacity-70" aria-hidden="true" /><span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f3f0] text-[#0c5660] motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110"><Icon className="h-5 w-5" aria-hidden="true" /></span><h3 className="relative mt-4 text-sm font-semibold text-[#12343b]">{copy.title}</h3><p className="relative mt-2 text-xs leading-5 text-slate-600">{copy.copy}</p><p className={`relative overflow-hidden text-xs leading-5 text-[#0c5660] motion-safe:transition-[max-height,margin,opacity] motion-safe:duration-200 ${isActive ? "mt-3 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0"}`}>{copy.practice}</p><span className="relative mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0c5660]">{isActive ? (isArabic ? "تقليل التفاصيل" : "Hide detail") : (isArabic ? "اضغط للتطبيق" : "Open practice")}</span></button>;
            })}
          </div>
        </div>
      </section>

      <section id="care-workspace" className="scroll-mt-20 border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-20">
          <div className={isArabic ? "lg:order-2" : ""}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b9dcd6] bg-[#f1f9f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#0c5660]"><HeartPulse className="h-4 w-4" aria-hidden="true" />{isArabic ? "مساحة الرعاية السريرية" : "Clinical care workspace"}</div>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#12343b] sm:text-5xl lg:text-6xl">{isArabic ? "عندما تحتاج المحبة إلى خطوة تالية واضحة" : "When love needs a clear next step"}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{isArabic ? "تيلستب يساعد أصحاب الحيوانات والأطباء البيطريين على تنظيم الأعراض، الوصول إلى العيادات، متابعة السجل الصحي، والتعلم من إرشادات واضحة." : "TELSTP helps pet owners and veterinarians organize symptoms, reach clinics, maintain health records, and learn from clear guidance."}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-[#0c5660] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#08434b]">{isArabic ? "افتح مساحة الرعاية" : "Open care workspace"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/clinic-locator" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0c5660]/40 hover:text-[#0c5660]"><MapPin className="h-4 w-4" aria-hidden="true" />{isArabic ? "اعثر على عيادة" : "Find a clinic"}</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#0c5660]" aria-hidden="true" />{isArabic ? "إرشاد آمن" : "Safety-first guidance"}</span><span className="inline-flex items-center gap-2"><Stethoscope className="h-4 w-4 text-[#0c5660]" aria-hidden="true" />{isArabic ? "مصمم للأطباء والأسر" : "Built for clinicians and families"}</span></div>
          </div>
          <div className={`relative ${isArabic ? "lg:order-1" : ""}`}>
            <div className="absolute -inset-4 rounded-[2rem] bg-[#dcefeb] blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[1.4rem] border border-[#b9dcd6] bg-[#edf5f4] p-5 shadow-[0_22px_60px_rgba(18,52,59,0.12)] sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-[#cfe8e4] pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0c5660]">{isArabic ? "مساحة تسليم الرعاية" : "Care handoff workspace"}</p><h3 className="mt-2 text-xl font-semibold text-[#12343b]">{isArabic ? "من الملاحظة إلى الخطوة التالية" : "From observation to the next safe step"}</h3></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0c5660] shadow-sm"><HeartPulse className="h-5 w-5" aria-hidden="true" /></span></div>
              <div className="relative mt-6 space-y-4"><div className="absolute start-[15px] top-6 bottom-6 w-px bg-[#b9dcd6]" aria-hidden="true" />{[
                { label: isArabic ? "سجل الملاحظة" : "Record the observation", detail: isArabic ? "الأعراض، المدة، والصور عند الحاجة" : "Symptoms, timing, and images when useful", icon: Stethoscope },
                { label: isArabic ? "افهم مستوى الاستعجال" : "Understand urgency", detail: isArabic ? "إرشاد أولي مع حدود واضحة للتصعيد" : "Initial guidance with clear escalation boundaries", icon: ShieldCheck },
                { label: isArabic ? "تواصل مع الطبيب" : "Reach the veterinarian", detail: isArabic ? "سجل منظم يمكن مشاركته في العيادة" : "Organized context to carry into the clinic", icon: MapPin },
              ].map(({ label, detail, icon: Icon }) => <div key={label} className="relative flex items-start gap-4 rounded-xl border border-white bg-white/80 p-4 shadow-sm"><span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0c5660] text-white"><Icon className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-sm font-semibold text-[#12343b]">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div></div>)}</div>
              <div className="mt-6 rounded-xl border border-[#c5dfda] bg-white/70 p-4 text-xs leading-5 text-slate-600"><span className="font-semibold text-[#0c5660]">{isArabic ? "مبدأ المنصة: " : "Platform principle: "}</span>{isArabic ? "الذكاء الاصطناعي يساعد، والطبيب البيطري يقرر." : "AI assists; the veterinarian decides."}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8 lg:py-18">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0c5660]">{isArabic ? "مسارات الرعاية" : "Care pathways"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#12343b]">{isArabic ? "كل ما يحتاجه صاحب الحيوان في مكان واضح" : "The essential owner workflows, in one clear place"}</h2><p className="mt-4 text-base leading-7 text-slate-600">{isArabic ? "اختر المسار المناسب الآن، ثم احتفظ بالسياق الصحي للخطوة التالية." : "Choose the right path now, then carry the health context into the next step."}</p></div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{pathways.map((pathway) => { const Icon = pathway.icon; const copy = isArabic ? pathway.ar : pathway.en; return <Link key={pathway.href} href={pathway.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#9bcac3] hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[pathway.tone]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span><h3 className="mt-5 text-lg font-semibold text-[#12343b]">{copy.title}</h3><p className="mt-2 min-h-[3.5rem] text-sm leading-6 text-slate-600">{copy.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0c5660]">{isArabic ? "افتح المسار" : "Open pathway"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span></Link>; })}</div>
      </section>

      <section className="border-y border-slate-200 bg-[#edf5f4]"><div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-14 lg:grid-cols-2 lg:px-8"><div className="rounded-2xl border border-[#c5dfda] bg-white p-7"><div className="flex items-center gap-3"><HeartPulse className="h-5 w-5 text-[#0c5660]" aria-hidden="true" /><h2 className="text-xl font-semibold text-[#12343b]">{isArabic ? "لأصحاب الحيوانات" : "For pet owners"}</h2></div><p className="mt-4 text-sm leading-7 text-slate-600">{isArabic ? "ابدأ بملف حيوان واضح، افهم متى تحتاج إلى طوارئ، واستعد ببيانات مفيدة قبل زيارة الطبيب." : "Start with a clear pet profile, understand when care is urgent, and arrive at the clinic with useful context."}</p><Link href="/register-pet" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0c5660]">{isArabic ? "سجل حيوانك" : "Register a pet"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div><div className="rounded-2xl border border-[#c5dfda] bg-[#12343b] p-7 text-white"><div className="flex items-center gap-3"><Stethoscope className="h-5 w-5 text-[#a8d8ce]" aria-hidden="true" /><h2 className="text-xl font-semibold">{isArabic ? "للأطباء والعيادات" : "For veterinarians and clinics"}</h2></div><p className="mt-4 text-sm leading-7 text-slate-300">{isArabic ? "اعرض تخصصك، نظم الطلبات، وشارك في شبكة رعاية أكثر وضوحاً لأصحاب الحيوانات في مصر." : "Present your specialty, manage requests, and participate in a clearer care network for pet owners across Egypt."}</p><Link href="/vet-registration" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a8d8ce]">{isArabic ? "افتح بوابة الطبيب" : "Open veterinarian portal"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></div></section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8 lg:py-18"><div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0c5660]">{isArabic ? "مبدأ المنصة" : "Platform principle"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#12343b]">{isArabic ? "الذكاء الاصطناعي يساعد. الطبيب يقرر." : "AI assists. Veterinarians decide."}</h2></div><div className="grid gap-4 sm:grid-cols-3">{[
        { icon: ShieldCheck, en: "Clear escalation", ar: "تصعيد واضح", copyEn: "Emergency flows point owners toward human care.", copyAr: "مسارات الطوارئ توجه صاحب الحيوان إلى الرعاية البشرية." },
        { icon: Syringe, en: "Preventive care", ar: "رعاية وقائية", copyEn: "Education supports vaccination, nutrition, and follow-up.", copyAr: "التعليم يدعم التطعيم والتغذية والمتابعة." },
        { icon: Stethoscope, en: "Clinical context", ar: "سياق سريري", copyEn: "Records and history are designed to be useful at the clinic.", copyAr: "السجلات والتاريخ مصممان ليكونا مفيدين في العيادة." },
      ].map((item) => { const Icon = item.icon; return <div key={item.en} className="rounded-xl border border-slate-200 bg-white p-5"><Icon className="h-5 w-5 text-[#0c5660]" aria-hidden="true" /><h3 className="mt-4 text-sm font-semibold text-slate-800">{isArabic ? item.ar : item.en}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{isArabic ? item.copyAr : item.copyEn}</p></div>; })}</div></div></section>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .paws-gateway-media { animation: pawsGatewayBreathe 18s cubic-bezier(0.23, 1, 0.32, 1) infinite alternate; }
          .paws-gateway-vignette { animation: pawsGatewayGlow 9s cubic-bezier(0.77, 0, 0.175, 1) infinite alternate; }
          .paws-gateway-embers span { position: absolute; width: 0.4rem; height: 0.4rem; border-radius: 999px; background: #f7db83; box-shadow: 0 0 18px rgba(247,219,131,.9); animation: pawsGatewayFloat 8s linear infinite; }
          .paws-gateway-embers span:nth-child(1) { left: 12%; bottom: 18%; animation-delay: -1s; }
          .paws-gateway-embers span:nth-child(2) { left: 31%; bottom: 11%; animation-delay: -5s; transform: scale(.55); }
          .paws-gateway-embers span:nth-child(3) { left: 51%; bottom: 24%; animation-delay: -2.4s; transform: scale(.8); }
          .paws-gateway-embers span:nth-child(4) { left: 68%; bottom: 15%; animation-delay: -6.8s; transform: scale(.6); }
          .paws-gateway-embers span:nth-child(5) { left: 78%; bottom: 31%; animation-delay: -3.6s; transform: scale(.45); }
          .paws-gateway-embers span:nth-child(6) { left: 91%; bottom: 12%; animation-delay: -7.4s; transform: scale(.7); }
        }
        @keyframes pawsGatewayBreathe { from { transform: scale(1.01); } to { transform: scale(1.08); } }
        @keyframes pawsGatewayGlow { from { opacity: .55; transform: scale(1); } to { opacity: 1; transform: scale(1.04); } }
        @keyframes pawsGatewayFloat { from { opacity: 0; translate: 0 1rem; } 15% { opacity: .95; } to { opacity: 0; translate: 2rem -22rem; } }
      `}</style>
    </ProfessionalShell>
  );
}
