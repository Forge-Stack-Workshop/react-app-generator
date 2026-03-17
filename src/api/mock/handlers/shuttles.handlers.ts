import { http, HttpResponse } from "msw";
import { shuttlesKpiData } from "../data/shuttles-kpi.data";

export const shuttlesHandlers = [
  http.get("/api/kpis/shuttles", () => {
    return HttpResponse.json(shuttlesKpiData);
  }),

  http.get("/api/kpis/shuttles/history", ({ request }) => {
    const url = new URL(request.url);
    const territory = url.searchParams.get("territory") ?? "ALL";

    const base =
      territory === "ALL"
        ? shuttlesKpiData.online
        : shuttlesKpiData.byTerritory[territory].online;

    const points = Array.from({ length: 12 }).map((_, i) => {
      const hour = (new Date().getHours() - (11 - i) + 24) % 24;

      const value = Math.max(
        0,
        Math.floor(base * (0.6 + Math.random() * 0.4))
      );

      return { hour, value };
    });

    return HttpResponse.json({ points });
  })
];
