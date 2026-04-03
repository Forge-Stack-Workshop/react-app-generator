import { useEffect, useCallback } from "react";
import { useTerritoriesQuery } from "../../domain/territories/queries";
import type { Map as LeafletMap } from "leaflet";

// Calcule la dispersion géographique des territoires
function getTerritorySpread(coordsList: [number, number][]) {
  const lats = coordsList.map((c) => c[0]);
  const lngs = coordsList.map((c) => c[1]);

  const latSpread = Math.max(...lats) - Math.min(...lats);
  const lngSpread = Math.max(...lngs) - Math.min(...lngs);

  return Math.max(latSpread, lngSpread);
}

interface TerritoryRef {
  id?: string;
  lat?: number;
  lng?: number;
}

export function useLeafletTerritory(
  map: LeafletMap | null,
  selectedTerritory: TerritoryRef | null,
) {
  const { data: territories } = useTerritoriesQuery();

  const refocus = useCallback(() => {
    if (!map || !territories) return;

    // 🔥 Cas ALL → zoom global sur toutes les pins
    if (selectedTerritory?.id === "ALL") {
      const coordsList = territories
        .filter((t) => t.id !== "ALL" && t.lat != null && t.lng != null)
        .map((t): [number, number] => [t.lat, t.lng]);

      if (coordsList.length === 0) return;

      const spread = getTerritorySpread(coordsList);

      let minZoom = 5;
      if (spread > 8) minZoom = 4;
      if (spread > 12) minZoom = 3.5;

      map.setMinZoom(minZoom);

      map.fitBounds(coordsList, {
        padding: [80, 80],
        maxZoom: 8,
      });

      return;
    }

    // 🔥 Cas territoire individuel
    if (selectedTerritory?.lat != null && selectedTerritory?.lng != null) {
      map.setView([selectedTerritory.lat, selectedTerritory.lng], 11);
    }
  }, [map, territories, selectedTerritory]);

  useEffect(() => {
    refocus();
  }, [refocus]);

  return { refocus };
}
