import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

// Route guard: renders the matched child routes only when authenticated,
// otherwise redirects to the login page. Use as a layout route element:
//   { element: <ProtectedRoute />, children: [...] }
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
