import { territoriesData } from "./territories.data";

function generateTerritoryKpi(total: number) {
  const online = Math.floor(total * (0.55 + Math.random() * 0.15)); // 55–70%
  const unstable = Math.floor(total * (0.1 + Math.random() * 0.1)); // 10–20%
  const error = Math.floor(total * (0.05 + Math.random() * 0.05)); // 5–10%
  const offline = total - online - unstable - error;

  return { total, online, unstable, error, offline };
}

const baseTotals: Record<string, number> = {
  paris: 520,
  lyon: 310,
  marseille: 280,
  lille: 190,
  bordeaux: 160,
  toulouse: 170,
  nice: 150,
  bruxelles: 210,
  amsterdam: 240,
  berlin: 300,
  madrid: 260,
};

export const shuttlesKpiData = (() => {
  const byTerritory: Record<
    string,
    ReturnType<typeof generateTerritoryKpi>
  > = {};

  territoriesData.forEach((t) => {
    byTerritory[t.id] = generateTerritoryKpi(baseTotals[t.id]);
  });

  // Agrégation ALL
  const allTotals = Object.values(byTerritory).reduce(
    (acc, t) => ({
      total: acc.total + t.total,
      online: acc.online + t.online,
      unstable: acc.unstable + t.unstable,
      error: acc.error + t.error,
      offline: acc.offline + t.offline,
    }),
    { total: 0, online: 0, unstable: 0, error: 0, offline: 0 },
  );

  return {
    ...allTotals,
    byTerritory,
  };
})();
