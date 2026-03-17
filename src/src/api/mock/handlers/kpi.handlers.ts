import { http, HttpResponse } from "msw";
import { kpisData } from "../data/kpi.data";

export const kpisHandlers = [
  http.get("/api/kpis", async () => {
    await new Promise((r) => setTimeout(r, 1500));
    return HttpResponse.json(kpisData);
  }),
];
