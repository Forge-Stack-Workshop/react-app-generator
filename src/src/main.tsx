import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";

import "./i18n";
import "leaflet/dist/leaflet.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = document.getElementById("root")!;

const queryClient = new QueryClient();

if (import.meta.env.DEV) {
  const { worker } = await import("./api/mock/server");
  worker.start();
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
