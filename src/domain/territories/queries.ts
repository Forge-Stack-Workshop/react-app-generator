import { useQuery } from "@tanstack/react-query";
import type { Territory, TerritoryProviders } from "./territory.types";

export function useTerritoriesQuery() {
  return useQuery<Territory[]>({
    queryKey: ["territories"],
    queryFn: async () => {
      const res = await fetch("/api/territories");
      if (!res.ok) throw new Error("Failed to fetch territories");
      return res.json();
    },
  });
}

export function useTerritoriesProvidersQuery() {
  return useQuery<Record<string, TerritoryProviders>>({
    queryKey: ["territories-providers"],
    queryFn: async () => {
      const res = await fetch("/api/territories/providers");
      if (!res.ok) throw new Error("Failed to fetch territories providers");
      return res.json();
    },
  });
}
