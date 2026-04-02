/**
 * UsersKpi
 * --------
 * Affiche :
 *   - Le nombre d'utilisateurs connectés (valeur principale)
 *   - Le total d'utilisateurs
 *   - Un graphique d'évolution (UsersKpiGraph)
 *
 * Logique métier :
 *   Toute la logique de sélection et de fallback est externalisée
 *   dans domain/users/useUsersMetrics.ts.
 */

import KpiCard from "../../../components/cards/KpiCard";
import { FaUser } from "react-icons/fa";
import { useUsersKpiQuery, useUsersHistoryQuery } from "../../../domain/users";
import UsersKpiGraph from "./UsersKpiGraph";
import { computeUsersMetrics } from "../../../domain/users/useUsersMetrics";

import styles from "./UsersKpi.module.scss";
import { useTranslation } from "react-i18next";

export default function UsersKpi({ selectedTerritory }) {
  const { t } = useTranslation("common");

  const { data, isLoading } = useUsersKpiQuery();
  const { data: history } = useUsersHistoryQuery(selectedTerritory.id);

  if (isLoading || !data) {
    return <KpiCard title={t("users_kpi_title")} icon={<FaUser />} isLoading />;
  }

  // Logique métier externalisée
  const metrics = computeUsersMetrics(data, selectedTerritory);

  return (
    <KpiCard
      title={t("users_kpi_title")}
      icon={<FaUser />}
      value={
        <div className={styles.usersKpi}>
          <div className={styles.hero}>{metrics.connected}</div>
          <div className={styles.sub}>{t("users_connected")}</div>
          <div className={styles.total}>
            {t("users_total", { total: metrics.total })}
          </div>
        </div>
      }
      footer={
        <div className={styles.graphWrapper}>
          <UsersKpiGraph data={history?.points ?? []} />
        </div>
      }
    />
  );
}
