import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Dark-mode CSS variable overrides (`html.dark { ... }`). Importing it here
// (rather than from base's global stylesheet) keeps `templates/base` buildable
// without the theming feature enabled: the `dark` class is simply never
// applied, and these overrides never enter the bundle.
import "../../styles/_theme.scss";

const STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

function readInitialTheme(): Theme {
  if (typeof localStorage === "undefined") return "light";
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
