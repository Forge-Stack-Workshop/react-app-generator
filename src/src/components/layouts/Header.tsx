import styles from "./Header.module.scss";
import { useTheme } from "../../hooks/useTheme";
import LanguageSwitcher from "../languages/LanguageSwitcher";

import logoLight from "../../assets/img/logo-light.svg";
import logoDark from "../../assets/img/logo-dark.svg";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const logo = theme === "light" ? logoLight : logoDark;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.brand}>Backoffice</span>
      </div>

      <div className={styles.right}>
        <button
          className={styles.themeToggle}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
