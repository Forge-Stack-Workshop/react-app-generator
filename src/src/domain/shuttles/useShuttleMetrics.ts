/**
 * computeShuttleMetrics
 * ---------------------
 * Fonction métier dédiée au domaine "shuttles".
 *
 * Rôle :
 *   - Centraliser tous les calculs dérivés liés aux navettes.
 *   - Garder les composants UI (ShuttlesKpi) simples et lisibles.
 *   - Faciliter la maintenance et l’évolution des règles métier.
 *
 * Entrée :
 *   metrics = {
 *     online: number,
 *     unstable: number,
 *     error: number,
 *     offline: number
 *   }
 *
 * Sortie :
 *   {
 *     total: number,
 *     availability: number (0 → 1),
 *     issues: number (0 → 1),
 *     maxValue: number (pour normaliser les bar charts)
 *   }
 */

export function computeShuttleMetrics(metrics: {
  online: number;
  unstable: number;
  error: number;
  offline: number;
}) {
  const total =
    metrics.online + metrics.unstable + metrics.error + metrics.offline;

  const availability = total === 0 ? 0 : metrics.online / total;

  const issues =
    total === 0
      ? 0
      : (metrics.unstable + metrics.error + metrics.offline) / total;

  const maxValue = Math.max(metrics.unstable, metrics.error, metrics.offline);

  return {
    total,
    availability,
    issues,
    maxValue,
  };
}
