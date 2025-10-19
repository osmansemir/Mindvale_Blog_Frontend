import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * ProtectedRoute component - Protects routes that require authentication
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route (optional)
 * @param {React.ReactNode} props.fallback - Component to show while loading (optional)
 *
 * @example
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles, fallback }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);

    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4 max-w-md px-4">
            <div className="text-6xl">🚫</div>
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
              {user?.role && ` Your current role is: ${user.role}`}
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: {allowedRoles.join(" or ")}
            </p>
            <div className="pt-4">
              <a
                href="/"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required role (if specified)
  return children;
}
