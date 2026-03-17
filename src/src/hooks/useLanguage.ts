import { useTranslation } from "react-i18next";
import frFlag from "../assets/img/flags/fr.svg";
import enFlag from "../assets/img/flags/en.svg";

export type Lang = "fr" | "en";

export function useLanguage() {
  const { i18n } = useTranslation();

  const languages: Record<Lang, { label: string; flag: string }> = {
    fr: { label: "Français", flag: frFlag },
    en: { label: "English", flag: enFlag }
  };

  const current = (i18n.language as Lang) || "fr";

  const change = (lng: Lang) => {
    i18n.changeLanguage(lng);
  };

  return { current, languages, change };
}
