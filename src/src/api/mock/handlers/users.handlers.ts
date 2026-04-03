import { http, HttpResponse } from "msw";
import { usersKpiData } from "../data/users-kpi.data";
import { usersHistoryData } from "../data/users-history.data";

export const usersKpiHandlers = [
  http.get("/api/kpis/users", async () => {
    await new Promise((r) => setTimeout(r, 500));
    return HttpResponse.json(usersKpiData);
  }),

  http.get("/api/kpis/users/history", async ({ request }) => {
    const url = new URL(request.url);
    const territory = url.searchParams.get("territory") || "ALL";

    await new Promise((r) => setTimeout(r, 300));

    // Normalisation de la clé
    const key = territory === "ALL" ? "ALL" : territory.toLowerCase();

    // On clone la série pour éviter de muter le mock
    const series = [
      ...((usersHistoryData as Record<string, { hour: number; connected: number }[]>)[key] ?? []),
    ];

    // On ajoute le point courant pour cohérence KPI/graph
    const now = new Date();
    const nowHour = now.getHours();

    series.push({
      hour: nowHour,
      connected:
        territory === "ALL"
          ? usersKpiData.connected // KPI global
          : ((usersKpiData.byTerritory as Record<string, { total: number; connected: number }>)[territory]?.connected ?? 0), // KPI territoire
    });

    return HttpResponse.json({
      points: series,
    });
  }),
];
