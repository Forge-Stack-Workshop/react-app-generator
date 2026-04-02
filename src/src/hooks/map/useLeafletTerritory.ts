import { useEffect, useCallback } from "react";
import { useTerritoriesQuery } from "../../domain/territories/queries";

// Calcule la dispersion géographique des territoires
function getTerritorySpread(coordsList: [number, number][]) {
  const lats = coordsList.map((c) => c[0]);
  const lngs = coordsList.map((c) => c[1]);

  const latSpread = Math.max(...lats) - Math.min(...lats);
  const lngSpread = Math.max(...lngs) - Math.min(...lngs);

  return Math.max(latSpread, lngSpread);
}

// Partial Leaflet Map interface — only the methods used in this hook
interface LeafletMapRef {
  setMinZoom: (zoom: number) => void;
  fitBounds: (bounds: [number, number][], options?: { padding: number[]; maxZoom: number }) => void;
  setView: (coords: [number, number], zoom: number) => void;
}

interface TerritoryRef {
  id?: string;
  coords?: [number, number];
}

export function useLeafletTerritory(map: LeafletMapRef | null, selectedTerritory: TerritoryRef | null) {
  const { data: territories } = useTerritoriesQuery();

  const refocus = useCallback(() => {
    if (!map || !territories) return;

    // 🔥 Cas ALL → zoom global sur toutes les pins
    if (selectedTerritory?.id === "ALL") {
      const coordsList = territories
        .filter((t) => t.id !== "ALL" && t.coords)
        .map((t) => t.coords as [number, number]);

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
    if (selectedTerritory?.coords) {
      map.setView(selectedTerritory.coords, 11);
    }
  }, [map, territories, selectedTerritory]);

  useEffect(() => {
    refocus();
  }, [refocus]);

  return { refocus };
}
