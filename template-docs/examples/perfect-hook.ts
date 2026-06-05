// EXAMPLE — canonical pattern, copy & adapt.
// A data-fetching hook built on React Query.
import { useQuery } from "@tanstack/react-query";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(`/api/user?id=${id}`);
      if (!res.ok) throw new Error("Failed to load user");
      return res.json();
    },
  });
}
