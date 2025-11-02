import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * PublicRoute component - Redirects authenticated users away from auth pages
 * Used for login and register pages that should only be accessible to guests
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if NOT authenticated
 * @param {string} props.redirectTo - Where to redirect authenticated users (default: "/")
 *
 * @example
 * <PublicRoute>
 *   <Login />
 * </PublicRoute>
 */
export default function PublicRoute({ redirectTo = "/" }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect them away from auth pages
  if (isAuthenticated) {
    // Check if there's a saved redirect location from ProtectedRoute
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // User is not authenticated, show the auth page
  return <Outlet />;
}
