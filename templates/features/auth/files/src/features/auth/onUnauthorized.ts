// HTTP response-error handler contributed to the base client via
// hooks.generated.ts. The aggregator imports this by the file basename, so the
// exported function MUST be named exactly `onUnauthorized`:
//   import { onUnauthorized as h0 } from "../../features/auth/onUnauthorized";
//
// On a 401 the stored token is cleared and the user is redirected to /login.
// Any other error is a no-op so the caller's own error handling still runs.
export function onUnauthorized(error: unknown): void {
  const status = (error as { status?: number } | null)?.status;
  if (status === 401) {
    localStorage.removeItem("auth.token");
    if (typeof window !== "undefined") window.location.assign("/login");
  }
}
