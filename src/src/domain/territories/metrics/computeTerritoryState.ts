import type { TerritoryProviders } from "../territory.types";

export function computeTerritoryState(territory: TerritoryProviders | null | undefined) {
  if (!territory) return "unknown";

  const all = [
    ...(territory.shuttles ?? []),
    ...(territory.dispatch ?? []),
    ...(territory.security ?? []),
  ];

  if (all.length === 0) return "unknown";

  const states = all.map((p) => p.state);

  if (states.includes("errors")) return "error";
  if (states.includes("off")) return "unstable";
  if (states.includes("unknown")) return "unstable";
  if (states.every((s) => s === "off")) return "offline";
  if (states.every((s) => s === "on")) return "online";

  return "unknown";
}
