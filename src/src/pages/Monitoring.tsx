import { useState } from "react";
import SearchBar from "../components/filters/SearchBar";
import MapCard from "../components/cards/MapCard";
import styles from "./Monitoring.module.scss";
import { useTranslation } from "react-i18next";

import TerritoriesKpi from "../features/kpis/TerritoriesKpi/TerritoriesKpi";
import ShuttlesKpi from "../features/kpis/ShuttlesKpi/ShuttlesKpi";
import MissionsKpi from "../features/kpis/MissionsKpi/MissionsKpi";
import UsersKpi from "../features/kpis/UsersKpi/UsersKpi";
import { ALL_TERRITORY } from "../domain/territories/territory.types";

import TerritorySidePanel from "../features/kpis/TerritorySidePanel/TerritorySidePanel";

export default function Monitoring() {
  const { t } = useTranslation("common");

  const [selectedTerritory, setSelectedTerritory] = useState(ALL_TERRITORY);
  const [panelTerritory, setPanelTerritory] = useState<string | null>(null);

  const handleSelect = (territory) => {
    setSelectedTerritory(territory);
  };

  return (
    <div className={styles.monitoring}>
      <SearchBar
        onSelect={handleSelect}
        placeholder={t("searchbar_placeholder")}
      />

      <div className={styles.mapRow}>
        <MapCard selectedTerritory={selectedTerritory} />
      </div>

      <div className={styles.kpiArea}>
        <div className={styles.kpiGrid}>
          <TerritoriesKpi
            selectedTerritory={selectedTerritory}
            onTerritoryClick={(id) => setPanelTerritory(id)}
          />

          <ShuttlesKpi selectedTerritory={selectedTerritory} />
          <MissionsKpi selectedTerritory={selectedTerritory} />
          <UsersKpi selectedTerritory={selectedTerritory} />
        </div>
      </div>
    </div>
  );
}
