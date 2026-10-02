import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EmptyState, ErrorMessage, LoadingSpinner } from "../components/UI";
export function ProtectedRoute() {
  const { user, loading, error, restore } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} retry={restore} />;
  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}
export function RoleRoute({ role }) {
  const { user } = useAuth();
  return user?.role === role ? (
    <Outlet />
  ) : (
    <EmptyState
      title="This space is for a different role"
      description={`You need a ${role} account to access this page.`}
    />
  );
}
