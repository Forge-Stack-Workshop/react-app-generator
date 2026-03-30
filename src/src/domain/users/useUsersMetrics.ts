/**
 * computeUsersMetrics
 * -------------------
 * Logique métier pour les KPIs utilisateurs.
 *
 * Entrée :
 *   - data globale (total, connected)
 *   - data par territoire
 *   - selectedTerritory
 *
 * Sortie :
 *   {
 *     total: number,
 *     connected: number
 *   }
 */

export function computeUsersMetrics(data, selectedTerritory) {
  if (!data) {
    return { total: 0, connected: 0 };
  }

  // Vue globale
  if (selectedTerritory.id === "ALL") {
    return {
      total: data.total,
      connected: data.connected,
    };
  }

  // Vue par territoire
  return (
    data.byTerritory[selectedTerritory.id] ?? {
      total: 0,
      connected: 0,
    }
  );
}
