import { computeTerritoryState } from "./metrics/computeTerritoryState";
import type {
  Territory,
  TerritoryKpi,
  TerritoryProviders,
} from "./territory.types";

export function buildTerritoriesKpi(
  territories: Territory[],
  providersByTerritory: Record<string, TerritoryProviders>,
): TerritoryKpi {
  const kpi: TerritoryKpi = {
    total: territories.length,
    online: [],
    unstable: [],
    error: [],
    offline: [],
  };

  for (const t of territories) {
    const providers = providersByTerritory[t.id];
    const state = computeTerritoryState(providers);

    if (state === "online") kpi.online.push(t.name);
    else if (state === "unstable") kpi.unstable.push(t.name);
    else if (state === "error") kpi.error.push(t.name);
    else if (state === "offline") kpi.offline.push(t.name);
  }

  return kpi;
}

export function getTerritoryStatus(data: TerritoryKpi, name: string) {
  if (data.online.includes(name)) return "online";
  if (data.unstable.includes(name)) return "unstable";
  if (data.error.includes(name)) return "error";
  if (data.offline.includes(name)) return "offline";
  return null;
}

export function computeTerritoryMetrics(
  data: TerritoryKpi,
  selectedTerritory: Territory,
) {
  if (selectedTerritory.id === "ALL") {
    return {
      online: data.online,
      unstable: data.unstable,
      error: data.error,
      offline: data.offline,
      total: data.total,
    };
  }

  const name = selectedTerritory.name;
  const status = getTerritoryStatus(data, name);

  return {
    online: status === "online" ? [name] : [],
    unstable: status === "unstable" ? [name] : [],
    error: status === "error" ? [name] : [],
    offline: status === "offline" ? [name] : [],
    total: 1,
  };
}

export function normalizeMetrics(metrics) {
  const count = (v) =>
    Array.isArray(v) ? v.length : typeof v === "number" ? v : 0;

  const safe = {
    online: count(metrics.online),
    unstable: count(metrics.unstable),
    error: count(metrics.error),
    offline: count(metrics.offline),
  };

  const total = safe.online + safe.unstable + safe.error + safe.offline;

  return { safe, total };
}
