import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./locales/fr/common.json";
import en from "./locales/en/common.json";

i18n
  .use(LanguageDetector) // detect and persist the language
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"], // keep the language after refresh
    },

    interpolation: {
      escapeValue: false,
    },

    resources: {
      fr: { common: fr },
      en: { common: en },
    },
  });

export default i18n;
