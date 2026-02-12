"use client";

import { ReactNode, useState, useCallback, useEffect } from "react";
import { LanguageContext, type Language } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const isRTL = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = translations[language] as Record<string, string>;
      return dict[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, isRTL, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
