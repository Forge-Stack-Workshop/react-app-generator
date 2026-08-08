import { useContext } from "react";
import { ThemeContext } from "../features/theming/ThemeProvider";

// Thin re-export so consumers can `import { useTheme } from "../../hooks/useTheme"`
// without knowing the theming feature lives under `features/theming`. The state
// itself is owned by ThemeProvider's context, not by this hook.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
