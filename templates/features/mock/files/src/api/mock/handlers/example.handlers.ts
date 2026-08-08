import { http, HttpResponse } from "msw";

export const exampleHandlers = [
  http.get("{{apiBaseUrl}}/example", () =>
    HttpResponse.json({ message: "Hello from MSW" }),
  ),
];
