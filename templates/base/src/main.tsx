import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FeatureProviders } from "./app/providers.generated";
import App from "./App";
import "./styles/index.scss";

const root = document.getElementById("root")!;
const queryClient = new QueryClient();

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FeatureProviders>
        <App />
      </FeatureProviders>
    </QueryClientProvider>
  </StrictMode>,
);
