import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context value
 * @property {Object|null} user - Current authenticated user
 * @property {string|null} token - JWT token
 * @property {boolean} loading - Loading state during auth check
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {Function} setIsAuthenticated - set isAuthenticated state
 * @property {Function} login - Login function (email, password)
 * @property {Function} register - Register function (name, email, password, role)
 * @property {Function} logout - Logout function
 * @property {Function} checkAuth - Revalidate authentication
 * @property {Function} updateUser - Update user data in context
 */

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
