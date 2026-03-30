import { useQuery } from "@tanstack/react-query";
import type { ShuttlesKpi } from "./types";

export function useShuttlesKpiQuery() {
  return useQuery<ShuttlesKpi>({
    queryKey: ["shuttles-kpi"],
    queryFn: async () => {
      const res = await fetch("/api/kpis/shuttles");
      return res.json();
    },
  });
}
