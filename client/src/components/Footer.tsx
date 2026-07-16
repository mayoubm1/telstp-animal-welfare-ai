/**
 * Professional Footer Component
 * TAWASOL Life Sciences Technology Park branding and official credits
 */

import React, { useState } from "react";

interface FooterProps {
  language?: "en" | "ar";
}

export const Footer: React.FC<FooterProps> = ({ language = "en" }) => {
  const [showCredits, setShowCredits] = useState(false);

  const content = {
    en: {
      title: "TELSTP",
      subtitle: "Tawasol Life Science Technology Park",
      rights: "© 2026 All Rights Reserved",
      architect: "Architect & Visionary: Dr. Mohamed Ayoub",
      constructor: "Constructor: Agent Manus AI",
      dataset: "Outreach Dataset: Gemini Flash Pro",
      os: "OS: Hum-Ai Collaborative Effort",
      email: "3m.ayoub@gmail.com",
      phone: "+201061046861",
      credits: "Special Credits",
      vision: "Pioneering AI-powered veterinary care for a healthier future",
      contact: "Contact",
    },
    ar: {
      title: "تيلستب",
      subtitle: "حديقة تكنولوجيا علوم الحياة تواصل",
      rights: "© 2026 جميع الحقوق محفوظة",
      architect: "المهندس والرؤية: د. محمد أيوب",
      constructor: "البناء: وكيل مانوس الذكي",
      dataset: "مجموعة البيانات الخارجية: Gemini Flash Pro",
      os: "نظام التشغيل: Hum-Ai جهد تعاوني",
      email: "3m.ayoub@gmail.com",
      phone: "+201061046861",
      credits: "شكر خاص",
      vision: "رائد في الرعاية البيطرية المدعومة بالذكاء الاصطناعي لمستقبل أكثر صحة",
      contact: "اتصل",
    },
  };

  const t = content[language];

  return (
    <footer className={`${language === "ar" ? "rtl" : "ltr"} bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-gray-300 border-t-4 border-yellow-500`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Branding Section */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              {/* TAWASOL Logo Placeholder */}
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white font-bold text-xl">🌿</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{t.title}</h3>
            <p className="text-sm text-yellow-400 font-semibold">{t.subtitle}</p>
            <p className="text-xs text-gray-400 mt-2">{t.rights}</p>
          </div>

          {/* Credits Section */}
          <div className="flex flex-col">
            <h4 className="text-lg font-bold text-yellow-400 mb-4">{t.credits}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">▸</span>
                <span>{t.architect}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">▸</span>
                <span>{t.constructor}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">▸</span>
                <span>{t.dataset}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">▸</span>
                <span>{t.os}</span>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col">
            <h4 className="text-lg font-bold text-yellow-400 mb-4">{t.contact}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-lg">📧</span>
                <a
                  href="mailto:3m.ayoub@gmail.com"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-lg">📱</span>
                <a
                  href="tel:+201061046861"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-yellow-400 text-lg">🌐</span>
                <span className="text-xs text-gray-400">{t.vision}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-yellow-400 transition-colors">
                  {language === "en" ? "Home" : "الرئيسية"}
                </a>
              </li>
              <li>
                <a href="/pet-companion-enhanced" className="hover:text-yellow-400 transition-colors">
                  {language === "en" ? "Virtual Pet" : "الحيوان الأليف الافتراضي"}
                </a>
              </li>
              <li>
                <a href="/natural-alternatives-enhanced" className="hover:text-yellow-400 transition-colors">
                  {language === "en" ? "Products" : "المنتجات"}
                </a>
              </li>
              <li>
                <a href="/clinic-locator" className="hover:text-yellow-400 transition-colors">
                  {language === "en" ? "Find Clinic" : "ابحث عن عيادة"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <div className="mb-4 md:mb-0">
            <p>
              {language === "en"
                ? "TELSTP © 2026 - Pioneering AI-Powered Veterinary Care"
                : "تيلستب © 2026 - رائد في الرعاية البيطرية المدعومة بالذكاء الاصطناعي"}
            </p>
            <p className="mt-1">
              {language === "en"
                ? "Built with ❤️ by Manus AI for TAWASOL Life Sciences Technology Park"
                : "تم بناؤه بـ ❤️ بواسطة Manus AI لحديقة تكنولوجيا علوم الحياة تواصل"}
            </p>
          </div>

          {/* Social/Legal Links */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowCredits(!showCredits)}
              className="hover:text-yellow-400 transition-colors underline"
            >
              {language === "en" ? "Full Credits" : "الاعتمادات الكاملة"}
            </button>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              {language === "en" ? "Privacy" : "الخصوصية"}
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              {language === "en" ? "Terms" : "الشروط"}
            </a>
          </div>
        </div>

        {/* Expanded Credits Modal */}
        {showCredits && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-yellow-400">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">
              {language === "en" ? "Full Project Credits" : "اعتمادات المشروع الكاملة"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-bold text-white mb-2">
                  {language === "en" ? "Vision & Architecture" : "الرؤية والعمارة"}
                </h4>
                <p className="text-gray-300">
                  {language === "en"
                    ? "Dr. Mohamed Ayoub - Project Architect and Visionary"
                    : "د. محمد أيوب - معماري المشروع والرؤية"}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">
                  {language === "en" ? "AI & Development" : "الذكاء الاصطناعي والتطوير"}
                </h4>
                <p className="text-gray-300">
                  {language === "en"
                    ? "Agent Manus - AI-Powered Development & Implementation"
                    : "وكيل Manus - التطوير والتنفيذ المدعوم بالذكاء الاصطناعي"}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">
                  {language === "en" ? "Data & Research" : "البيانات والبحث"}
                </h4>
                <p className="text-gray-300">
                  {language === "en"
                    ? "Gemini Flash Pro - Outreach Dataset & Research Support"
                    : "Gemini Flash Pro - دعم مجموعة البيانات والبحث"}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">
                  {language === "en" ? "Collaborative Platform" : "منصة التعاون"}
                </h4>
                <p className="text-gray-300">
                  {language === "en"
                    ? "Hum-Ai OS - Collaborative AI Effort & Infrastructure"
                    : "نظام Hum-Ai - جهد التعاون والبنية التحتية للذكاء الاصطناعي"}
                </p>
              </div>
            </div>

            {/* Contact & Organization */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-bold text-yellow-400 mb-3">
                {language === "en" ? "Organization & Contact" : "المنظمة والاتصال"}
              </h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="font-bold text-white">TAWASOL Life Sciences Technology Park</span>
                </p>
                <p>
                  {language === "en" ? "Architect: " : "المهندس: "}
                  <span className="text-yellow-400">Dr. Mohamed Ayoub</span>
                </p>
                <p>
                  📧{" "}
                  <a href="mailto:3m.ayoub@gmail.com" className="text-yellow-400 hover:underline">
                    3m.ayoub@gmail.com
                  </a>
                </p>
                <p>
                  📱{" "}
                  <a href="tel:+201061046861" className="text-yellow-400 hover:underline">
                    +201061046861
                  </a>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCredits(false)}
              className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded transition-colors"
            >
              {language === "en" ? "Close" : "إغلاق"}
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
