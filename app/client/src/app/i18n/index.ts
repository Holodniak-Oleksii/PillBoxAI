import { EAvailableLanguage } from "@/shared/types/enums";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: EAvailableLanguage.EN,
    supportedLngs: Object.values(EAvailableLanguage),
    interpolation: {
      escapeValue: false,
    },
    debug: true,
    detection: {
      order: ["queryString", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["cookie"],
    },
  });

export default i18n;
