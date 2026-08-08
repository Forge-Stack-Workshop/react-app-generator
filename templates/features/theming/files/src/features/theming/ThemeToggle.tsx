import styles from "./ThemeToggle.module.scss";
import { useTheme } from "../../hooks/useTheme";

// Standalone button for pages/header to drop in. Reads/sets the theme via the
// ThemeProvider context (through the useTheme hook) — no local state.
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.themeToggle}
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
