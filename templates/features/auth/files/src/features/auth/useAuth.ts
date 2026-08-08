import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./AuthProvider";

// Reads the auth context. Throws if called outside an <AuthProvider>, so a
// missing provider fails loudly at render time instead of silently returning
// an unauthenticated state.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
