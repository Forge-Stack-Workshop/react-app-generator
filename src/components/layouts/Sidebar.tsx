import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  CloudSun,
  Map,
  Bus,
  Factory,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation("common");


  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.top}>
        <h2 className={styles.logo}></h2>

        <button
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" className={styles.link}>
          <CloudSun size={20} />
          <span>{t("sidebar.weather")}</span>
        </NavLink>

        <NavLink to="/territories" className={styles.link}>
          <Map size={20} />
          <span>{t("sidebar.territories")}</span>
        </NavLink>

        <NavLink to="/shuttles" className={styles.link}>
          <Bus size={20} />
          <span>{t("sidebar.shuttles")}</span>
        </NavLink>

        <NavLink to="/providers" className={styles.link}>
          <Factory size={20} />
          <span>{t("sidebar.providers")}</span>
        </NavLink>
      </nav>
    </aside>
  );
}
