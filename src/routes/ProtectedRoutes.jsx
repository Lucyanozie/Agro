import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Route guard component for authenticated & role-authorized areas.
 * - Redirects to /login if unauthenticated, preserving the intended path in state.
 * - Redirects to role home (/farmer or /buyer) if role does not match.
 */
export function ProtectedRoutes({ role }) {
  const { user, isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user && user.role !== role) {
    return (
      <Navigate to={user.role === "farmer" ? "/farmer" : "/buyer"} replace />
    );
  }

  return <Outlet />;
}
