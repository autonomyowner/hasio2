"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// We'll import translations dynamically to avoid circular deps
let translationsCache: Record<string, Record<string, string>> | null = null;

async function loadTranslations() {
  if (!translationsCache) {
    try {
      const mod = await import("@/lib/translations");
      translationsCache = mod.translations as any;
    } catch {
      translationsCache = { en: {}, ar: {} };
    }
  }
  return translationsCache;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  isRTL: false,
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export { type Language, type LanguageContextType };
