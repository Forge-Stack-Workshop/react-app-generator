import { http, HttpResponse } from "msw";
import { territoriesData } from "../data/territories.data";
import { territoryProviders } from "../data/territories.data";

export const territoriesHandlers = [
  http.get("/api/territories", async () => {
    await new Promise((r) => setTimeout(r, 800));
    return HttpResponse.json(territoriesData);
  }),

  http.get("/api/territories/providers", async () => {
    await new Promise((r) => setTimeout(r, 800));
    return HttpResponse.json(territoryProviders);
  }),
];
