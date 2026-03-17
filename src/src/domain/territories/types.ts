export interface Territory {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// Territoire agrégé global
export const ALL_TERRITORY: Territory = {
  id: "ALL",
  name: "Tous les territoires",
  lat: 46.5,
  lng: 2.5
};


export type TerritoryStatus = "online" | "unstable" | "error" | "offline";

export type TerritoryKpi = {
  total: number;
  online: string[];     // liste des noms
  unstable: string[];
  error: string[];
  offline: string[];
};
