import KpiCard from "../../../components/cards/KpiCard";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  useTerritoriesQuery,
  useTerritoriesProvidersQuery,
} from "../../../domain/territories/queries";
import HalfDonutGauge from "../../../components/charts/HalfDonutGauge/HalfDonutGauge";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

import {
  buildTerritoriesKpi,
  computeTerritoryMetrics,
  normalizeMetrics,
} from "../../../domain/territories/useTerritoryStatus";

import TerritorySidePanel from "../TerritorySidePanel/TerritorySidePanel";
import styles from "./TerritoriesKpi.module.scss";

export default function TerritoriesKpi({
  selectedTerritory,
  onTerritoryClick,
}) {
  const { t } = useTranslation("common");

  const { data: territories, isLoading: loadingTerritories } =
    useTerritoriesQuery();
  const { data: providers, isLoading: loadingProviders } =
    useTerritoriesProvidersQuery();

  const [open, setOpen] = useState<string | null>(null);
  const [localPanel, setLocalPanel] = useState<string | null>(null);
  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  // Derive activeTerritoryId from user selection or incoming prop (avoids setState in useEffect)
  const activeTerritoryId = userSelectedId ?? selectedTerritory?.id ?? null;

  const wrapperRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setLocalPanel(null);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  if (loadingTerritories || loadingProviders || !territories || !providers) {
    return (
      <KpiCard
        title={t("territories_kpi_title")}
        icon={<FaMapMarkedAlt />}
        isLoading
      />
    );
  }

  const kpi = buildTerritoriesKpi(territories, providers);
  const rawMetrics = computeTerritoryMetrics(kpi, selectedTerritory);
  const { safe, total } = normalizeMetrics(rawMetrics);

  const statuses = [
    { key: "online", color: styles.online, list: rawMetrics.online },
    { key: "unstable", color: styles.unstable, list: rawMetrics.unstable },
    { key: "error", color: styles.error, list: rawMetrics.error },
    { key: "offline", color: styles.offline, list: rawMetrics.offline },
  ];

  return (
    <KpiCard
      title={t("territories_kpi_title")}
      icon={<FaMapMarkedAlt />}
      value={
        <div className={styles.wrapper} ref={wrapperRef}>
          <div className={styles.gaugeWrapper}>
            <HalfDonutGauge
              online={safe.online}
              unstable={safe.unstable}
              error={safe.error}
              offline={safe.offline}
            />

            <div className={styles.gaugeCenter}>
              {total}
              <span>{t("territories_total")}</span>
            </div>
          </div>

          <div className={styles.separator} />

          <div className={styles.list}>
            {statuses.map((s) => (
              <div key={s.key} className={styles.item}>
                <div
                  className={styles.header}
                  onClick={() =>
                    Array.isArray(s.list)
                      ? setOpen(open === s.key ? null : s.key)
                      : null
                  }
                >
                  <span className={`${styles.dot} ${s.color}`} />
                  <span className={styles.label}>
                    {t(`territories_${s.key}`)}
                  </span>

                  <span className={styles.count}>{s.list.length}</span>

                  {Array.isArray(s.list) && (
                    <span className={styles.chevron}>
                      {open === s.key ? "▲" : "▼"}
                    </span>
                  )}
                </div>

                {open === s.key && Array.isArray(s.list) && (
                  <div className={styles.dropdown}>
                    {s.list.length === 0 ? (
                      <div className={styles.territory}>
                        {t("territories_none")}
                      </div>
                    ) : (
                      s.list.map((territoryId) => (
                        <div
                          key={territoryId}
                          className={`${styles.territory} ${
                            activeTerritoryId === territoryId
                              ? styles.territoryActive
                              : ""
                          }`}
                          onClick={() => {
                            const key = territoryId.toLowerCase(); // 🔥 FIX
                            setLocalPanel(key);
                            setUserSelectedId(key);
                            onTerritoryClick?.(key);
                          }}
                        >
                          {territoryId}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {localPanel && (
            <TerritorySidePanel
              territoryId={localPanel}
              onClose={() => setLocalPanel(null)}
            />
          )}
        </div>
      }
    />
  );
}
