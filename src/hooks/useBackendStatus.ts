import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Detects whether the backend API is reachable.
 *
 * Monitors:
 * - browser online/offline events (network layer)
 * - React Query cache errors (network-class errors only, not 4xx user errors)
 *
 * Returns `true` when the backend is unreachable.
 */
export function useBackendStatus(): boolean {
  const [isBackendDown, setIsBackendDown] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => setIsBackendDown(false);
    const handleOffline = () => setIsBackendDown(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== "updated") return;

      const { state } = event.query;
      if (state.status !== "error") return;

      const error = state.error as any;

      const isNetworkError =
        !navigator.onLine ||
        error?.code === "ECONNREFUSED" ||
        error?.code === "ENOTFOUND" ||
        error?.name === "NetworkError" ||
        error?.message?.toLowerCase().includes("network") ||
        error?.message?.toLowerCase().includes("failed to fetch") ||
        error?.message?.toLowerCase().includes("timeout");

      if (isNetworkError) {
        setIsBackendDown(true);
      }
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribe();
    };
  }, [queryClient]);

  return isBackendDown;
}
