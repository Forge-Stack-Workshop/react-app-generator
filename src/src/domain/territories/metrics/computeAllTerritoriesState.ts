// import { computeTerritoryState } from "./computeTerritoryState";
// import type { Territory, TerritoryProviders } from "../territory.types";

// /**
//  * Recalcule l'état global de tous les territoires
//  * à partir des providers déjà chargés par la query.
//  *
//  * ❗ Aucune adhérence API / mock ici.
//  * ❗ Les providers doivent être passés en paramètre.
//  */
// export function computeAllTerritoriesState(
//   territories: Territory[],
//   providersByTerritory: Record<string, TerritoryProviders>
// ) {
//   const result = {
//     online: [] as string[],
//     unstable: [] as string[],
//     error: [] as string[],
//     offline: [] as string[],
//     unknown: [] as string[]
//   };

//   for (const t of territories) {
//     const providers = providersByTerritory[t.id];
//     const state = computeTerritoryState(providers);
//     result[state].push(t.name);
//   }

//   return result;
// }
