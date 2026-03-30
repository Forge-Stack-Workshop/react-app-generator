/**
 * Le backend fournit déjà les 12 dernières heures dans l'ordre.
 * On normalise simplement l'heure et on formate le label.
 */

export function buildUsersGraphSlots(data) {
  if (!data || data.length === 0) return [];

  return data.map((p) => {
    const hour =
      typeof p.hour === "string"
        ? parseInt(p.hour.split(":")[0], 10)
        : Number(p.hour);

    return {
      hour,
      label: `${hour}h`,
      value: p.connected,
    };
  });
}
