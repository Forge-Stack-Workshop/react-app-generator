// Territoire simple
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

// Statuts possibles d'un territoire
export type TerritoryStatus = "online" | "unstable" | "error" | "offline";

// KPI global (ancien modèle, encore utilisé par la gauge)
export type TerritoryKpi = {
  total: number;
  online: string[];
  unstable: string[];
  error: string[];
  offline: string[];
};

// ---------------------------------------------------------
// Providers
// ---------------------------------------------------------

export type ProviderState = "on" | "off" | "errors" | "unknown";

export type Provider = {
  name: string;
  state: ProviderState;
};

export type TerritoryProviders = {
  shuttles: Provider[];
  dispatch: Provider[];
  security: Provider[];
};
