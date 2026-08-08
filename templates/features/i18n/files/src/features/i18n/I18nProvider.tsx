import type { ReactNode } from "react";

// Importing the i18n module for its side effect runs i18next's `.init()` and
// registers the react-i18next backend before any component calls
// `useTranslation`. i18next attaches its React context to the shared singleton,
// so no extra <I18nextProvider> wrapper is required here.
import "../../i18n";

export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
