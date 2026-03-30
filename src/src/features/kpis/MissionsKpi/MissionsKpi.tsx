import KpiCard from "../../../components/cards/KpiCard";
import { FaTasks } from "react-icons/fa";
import styles from "./MissionsKpi.module.scss";
import { useTranslation } from "react-i18next";

export default function MissionsKpi() {
  const { t } = useTranslation("common");

  return (
    <KpiCard
      title={t("missions_kpi_title")}
      icon={<FaTasks />}
      value={
        <div className={styles.wrapper}>
          <div className={styles.placeholder}>{t("missions_placeholder")}</div>
        </div>
      }
    />
  );
}
