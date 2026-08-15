import type { ReactNode } from "react";
import { Link } from "wouter";
import { HeartPulse, Languages, ShieldCheck, Stethoscope } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfessionalShellProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

const navigation = [
  { href: "/dashboard", en: "Care dashboard", ar: "لوحة الرعاية" },
  { href: "/symptom-checker", en: "Pet health tools", ar: "أدوات صحة الحيوان" },
  { href: "/clinic-locator", en: "Find a clinic", ar: "ابحث عن عيادة" },
  { href: "/training-programs", en: "Training", ar: "التدريب" },
  { href: "/best-practices", en: "Best practices", ar: "أفضل الممارسات" },
  { href: "/natural-alternatives", en: "Products", ar: "المنتجات" },
  { href: "/appointment-scheduling", en: "Consultations", ar: "الاستشارات" },
  { href: "/profile", en: "Pet profile", ar: "ملف الحيوان" },
  { href: "/vet-registration", en: "Veterinarian portal", ar: "بوابة الطبيب" },
];

const footerLinks = [
  { href: "/education-enhanced", en: "Education", ar: "التعليم" },
  { href: "/natural-alternatives", en: "Natural alternatives", ar: "البدائل الطبيعية" },
  { href: "/case-history", en: "Case history", ar: "السجل الطبي" },
  { href: "/pet-companion-enhanced", en: "Pet companion", ar: "رفيق الحيوان" },
  { href: "/appointment-scheduling", en: "Consultations", ar: "الاستشارات" },
];

export function ProfessionalShell({ children, className = "", showFooter = true }: ProfessionalShellProps) {
  const { language, setLanguage } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className={`min-h-screen bg-[#f4f7f8] text-slate-900 ${isArabic ? "rtl" : "ltr"} ${className}`}>
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-5 py-3 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="TELSTP home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c5660] text-white shadow-sm">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-[1.05rem] font-semibold tracking-[0.18em] text-[#12343b]">TELSTP</span>
              <span className="hidden text-[0.68rem] font-medium uppercase tracking-[0.12em] text-slate-500 sm:block">
                Tawasol Life Sciences
              </span>
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0 xl:flex" aria-label={isArabic ? "التنقل الرئيسي" : "Primary navigation"}>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2 text-[0.72rem] font-medium text-slate-600 transition-colors hover:bg-[#e9f4f3] hover:text-[#0c5660]"
              >
                {isArabic ? item.ar : item.en}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/vet-registration"
              className="hidden items-center gap-2 rounded-lg border border-[#0c5660]/25 bg-[#f2f8f7] px-3 py-2 text-xs font-semibold text-[#0c5660] transition-colors hover:border-[#0c5660]/50 hover:bg-[#e5f2f0] md:flex"
            >
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              {isArabic ? "للطبيب البيطري" : "For veterinarians"}
            </Link>
            <button
              type="button"
              onClick={() => setLanguage(isArabic ? "en" : "ar")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-[#0c5660]/40 hover:text-[#0c5660]"
              aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Languages className="h-4 w-4" aria-hidden="true" />
              {isArabic ? "English" : "العربية"}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto border-t border-slate-100 xl:hidden">
          <nav className="mx-auto flex max-w-[1440px] gap-1 px-5 py-2 lg:px-8" aria-label={isArabic ? "التنقل السريع" : "Quick navigation"}>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-[#e9f4f3] hover:text-[#0c5660]"
              >
                {isArabic ? item.ar : item.en}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      {showFooter && (
        <footer className="border-t border-slate-200 bg-[#102f35] text-slate-200">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8dc9bd] text-[#102f35]">
                  <HeartPulse className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold tracking-[0.18em] text-white">TELSTP</p>
                  <p className="text-xs text-slate-400">Tawasol Life Sciences Technology Park</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-400">
                {isArabic
                  ? "منصة رعاية بيطرية عملية تجمع بين المعرفة، الفرز الآمن، الوصول إلى العيادات، وسجل صحي واضح للحيوانات الأليفة."
                  : "A practical veterinary care platform connecting education, safe triage, clinic access, and clear health records for companion animals."}
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-[#a8d8ce]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {isArabic ? "الذكاء الاصطناعي لا يستبدل الطبيب البيطري" : "AI supports care; it does not replace a veterinarian."}
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{isArabic ? "الوصول السريع" : "Quick access"}</h2>
              <div className="grid gap-2 text-sm text-slate-400">
                {footerLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="transition-colors hover:text-[#a8d8ce]">
                    {isArabic ? item.ar : item.en}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{isArabic ? "التواصل" : "Contact"}</h2>
              <div className="space-y-2 text-sm text-slate-400">
                <a className="block hover:text-[#a8d8ce]" href="mailto:3m.ayoub@gmail.com">3m.ayoub@gmail.com</a>
                <a className="block hover:text-[#a8d8ce]" href="tel:+201061046861">+20 106 104 6861</a>
                <p className="pt-3 text-xs leading-5 text-slate-500">
                  {isArabic ? "تيلستب © 2026. جميع الحقوق محفوظة." : "TELSTP © 2026. All rights reserved."}
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
