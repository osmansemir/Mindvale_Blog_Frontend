import { useAuth } from "../../hooks/useAuth";

/**
 * RoleGuard component - Conditionally renders UI elements based on user role
 * This is for inline conditional rendering, not route protection (use ProtectedRoute for that)
 *
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles that can see this content
 * @param {React.ReactNode} props.children - Content to show if user has required role
 * @param {React.ReactNode} props.fallback - Content to show if user doesn't have required role (optional)
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 *
 * @example
 * // Only show for admins
 * <RoleGuard allowedRoles={['admin']}>
 *   <AdminButton />
 * </RoleGuard>
 *
 * @example
 * // Show different content for different roles
 * <RoleGuard allowedRoles={['admin']} fallback={<UserView />}>
 *   <AdminView />
 * </RoleGuard>
 *
 * @example
 * // Show only for authenticated users (any role)
 * <RoleGuard allowedRoles={['user', 'author', 'admin']}>
 *   <LogoutButton />
 * </RoleGuard>
 */
export default function RoleGuard({
  allowedRoles = [],
  children,
  fallback = null,
  requireAuth = true,
}) {
  const { user, isAuthenticated } = useAuth();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  // If no role restrictions, show children for authenticated users
  if (!allowedRoles || allowedRoles.length === 0) {
    return isAuthenticated ? children : fallback;
  }

  // Check if user has one of the allowed roles
  const hasRequiredRole = user?.role && allowedRoles.includes(user.role);

  return hasRequiredRole ? children : fallback;
}
