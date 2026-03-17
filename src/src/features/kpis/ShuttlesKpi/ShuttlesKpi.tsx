/**
 * ShuttlesKpi
 * -----------
 * Card KPI pour la flotte de navettes.
 *
 * Affiche :
 *   - Le nombre de navettes online (valeur principale)
 *   - La répartition par statut (unstable / error / offline)
 *   - Deux mini-donuts : availability rate & issues rate
 *
 * Logique métier :
 *   Toute la logique de calcul (totaux, ratios, max) est externalisée
 *   dans domain/shuttles/useShuttleMetrics.ts.
 *
 * UI :
 *   Les composants graphiques (MiniDonut, HorizontalBar) sont externalisés
 *   dans components/charts/.
 */

import KpiCard from "../../../components/cards/KpiCard";
import { FaShuttleVan } from "react-icons/fa";
import { useShuttlesKpiQuery } from "../../../domain/shuttles";
import { computeShuttleMetrics } from "../../../domain/shuttles/useShuttleMetrics";

import MiniDonut from "../../../components/charts/MiniDonut/MiniDonut";
import HorizontalBar from "../../../components/charts/HorizontalBar/HorizontalBar";

import styles from "./ShuttlesKpi.module.scss";
import { useTranslation } from "react-i18next";

type ShuttlesKpiProps = {
  selectedTerritory: { id: string };
};

export default function ShuttlesKpi({ selectedTerritory }: ShuttlesKpiProps) {
  const { t } = useTranslation("common");
  const { data, isLoading } = useShuttlesKpiQuery();

  if (isLoading || !data) {
    return (
      <KpiCard
        title={t("shuttles_kpi_title")}
        icon={<FaShuttleVan />}
        isLoading
      />
    );
  }

  // Sélection du territoire
  const metrics =
    selectedTerritory.id === "ALL"
      ? data
      : data.byTerritory[selectedTerritory.id];

  // Calculs métier (availability, issues, maxValue)
  const { availability, issues, maxValue } = computeShuttleMetrics(metrics);

  return (
    <KpiCard
      title={t("shuttles_kpi_title")}
      icon={<FaShuttleVan />}
      value={
        <div className={styles.wrapper}>

          {/* Valeur principale */}
          <div className={styles.mainValue}>
            <div className={styles.mainNumber}>{metrics.online}</div>
            <div className={styles.mainLabel}>{t("shuttles_online")}</div>
          </div>

          <div className={styles.separator} />

          {/* Bar charts */}
          <div className={styles.barChart}>
            <HorizontalBar
              label={t("shuttles_unstable")}
              value={metrics.unstable}
              max={maxValue}
              className={styles.unstable}
            />
            <HorizontalBar
              label={t("shuttles_error")}
              value={metrics.error}
              max={maxValue}
              className={styles.error}
            />
            <HorizontalBar
              label={t("shuttles_offline")}
              value={metrics.offline}
              max={maxValue}
              className={styles.offline}
            />
          </div>

          {/* Donuts */}
          <div className={styles.metricsRow}>
            <div className={styles.metricBlock}>
              <MiniDonut value={availability} valueClassName={styles.availability} />
              <div className={styles.metricLabel}>{t("shuttles_availability")}</div>
              <div className={styles.metricValue}>{Math.round(availability * 100)}%</div>
            </div>

            <div className={styles.metricBlock}>
              <MiniDonut value={issues} valueClassName={styles.issues} />
              <div className={styles.metricLabel}>{t("shuttles_issues")}</div>
              <div className={styles.metricValue}>{Math.round(issues * 100)}%</div>
            </div>
          </div>

        </div>
      }
    />
  );
}
