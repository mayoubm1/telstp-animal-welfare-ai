import { Link, useRoute } from "wouter";
import { ArrowLeft, Clock3, ExternalLink, MapPin, Phone, ShieldCheck, Stethoscope } from "lucide-react";
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
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

export default function VetClinicDetail() {
  const { isArabic } = useLanguage();
  const [, params] = useRoute("/vet-clinic/:id");
  const clinicId = params?.id || "";
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clinicId);
  const { data: clinic, isLoading, isError } = trpc.clinics.getById.useQuery({ id: clinicId }, { enabled: isValidUuid });
  const specialties = parseList(clinic?.specialties);

  return (
    <ProfessionalShell>
      <div className="mx-auto max-w-[1100px] px-5 py-10 lg:px-8">
        <Link href="/clinic-locator" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c5660] hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{isArabic ? "العودة إلى دليل العيادات" : "Back to clinic directory"}</Link>
        {isLoading && <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">{isArabic ? "جاري تحميل بيانات العيادة..." : "Loading clinic details..."}</div>}
        {(isError || !isValidUuid) && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800"><h1 className="font-semibold">{isArabic ? "تعذر الوصول إلى العيادة" : "Clinic details are unavailable"}</h1><p className="mt-2 text-sm">{isArabic ? "قد يكون الرابط غير صالح أو أن سجل العيادة غير متاح. عد إلى الدليل لاختيار عيادة من السجلات المنشورة." : "This link is invalid or the clinic record is unavailable. Return to the directory and choose a clinic from the published records."}</p></div>}
        {clinic && <article className="mt-8 space-y-6"><header className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="flex flex-wrap items-start justify-between gap-5"><div><div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0c5660]"><span>{clinic.clinic_type?.replaceAll("_", " ")}</span>{clinic.verified && <span className="inline-flex items-center gap-1 rounded-full bg-[#edf7f5] px-2.5 py-1 normal-case tracking-normal text-[#26704c]"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />{isArabic ? "موثق" : "Verified"}</span>}</div><h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#12343b] sm:text-4xl">{isArabic ? clinic.name_ar || clinic.name : clinic.name}</h1><p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0c5660]" aria-hidden="true" />{isArabic ? clinic.address_ar || clinic.address : clinic.address}, {clinic.city}</p></div><a href={`tel:${clinic.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-[#0c5660] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#08434b]"><Phone className="h-4 w-4" aria-hidden="true" />{isArabic ? "اتصل بالعيادة" : "Call clinic"}</a></div></header>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]"><section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-semibold text-[#12343b]">{isArabic ? "عن العيادة" : "About this clinic"}</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{isArabic ? clinic.description_ar || clinic.description || "لا يوجد وصف منشور." : clinic.description || "No description has been published for this clinic yet."}</p>{specialties.length > 0 && <div className="mt-7"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{isArabic ? "التخصصات" : "Specialties"}</p><div className="mt-3 flex flex-wrap gap-2">{specialties.map((specialty) => <span key={specialty} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">{specialty}</span>)}</div></div>}</section><aside className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold text-[#12343b]">{isArabic ? "الخدمات والمعلومات" : "Services and details"}</h2><div className="mt-4 space-y-3 text-sm text-slate-600"><p className="flex gap-3"><Clock3 className="h-4 w-4 shrink-0 text-[#0c5660]" aria-hidden="true" />{clinic.operating_hours ? String(clinic.operating_hours) : (isArabic ? "ساعات العمل غير منشورة" : "Operating hours not published")}</p><p className="flex gap-3"><Stethoscope className="h-4 w-4 shrink-0 text-[#0c5660]" aria-hidden="true" />{clinic.emergency_services ? (isArabic ? "خدمات طوارئ متاحة" : "Emergency services available") : (isArabic ? "خدمات عامة" : "General services")}</p><p className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-[#0c5660]" aria-hidden="true" />{clinic.phone}</p></div>{clinic.website && <a href={clinic.website} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0c5660] hover:underline"><ExternalLink className="h-4 w-4" aria-hidden="true" />{isArabic ? "زيارة الموقع" : "Visit website"}</a>}</div><div className="rounded-2xl border border-[#c5dfda] bg-[#edf7f5] p-5"><p className="text-sm font-semibold text-[#12343b]">{isArabic ? "قبل الزيارة" : "Before you visit"}</p><p className="mt-2 text-sm leading-6 text-slate-600">{isArabic ? "اتصل أولاً للتأكد من التخصص وساعات العمل، وخاصة في الحالات العاجلة." : "Call ahead to confirm specialty availability and opening hours, especially for urgent cases."}</p></div></aside></div></article>}
      </div>
    </ProfessionalShell>
  );
}
