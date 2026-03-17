import { useQuery } from "@tanstack/react-query";
import type { UsersKpiResponse, UsersHistoryResponse } from "./types.ts";

export function useUsersKpiQuery() {
  return useQuery<UsersKpiResponse>({
    queryKey: ["users-kpi"],
    queryFn: async () => {
      const res = await fetch("/api/kpis/users");
      if (!res.ok) throw new Error("Failed to load users KPI");
      return res.json();
    },
  });
}

export function useUsersHistoryQuery(territoryId: string) {
  return useQuery<UsersHistoryResponse>({
    queryKey: ["users-history", territoryId],
    queryFn: async () => {
      const res = await fetch(`/api/kpis/users/history?territory=${territoryId}`);
      if (!res.ok) throw new Error("Failed to load users history");
      return res.json();
    },
  });
}
