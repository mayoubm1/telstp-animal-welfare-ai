/**
 * App Layout Wrapper
 * Includes header, main content, and footer across all pages
 */

import React, { ReactNode } from "react";
import Footer from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
  language?: "en" | "ar";
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, language = "en" }) => {
  return (
    <div className={`${language === "ar" ? "rtl" : "ltr"} flex flex-col min-h-screen bg-gray-50`}>
      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
};

export default AppLayout;
