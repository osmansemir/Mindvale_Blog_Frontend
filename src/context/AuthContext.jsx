import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Update axios default headers when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  /**
   * Validate stored token and get user data
   */
  async function checkAuth() {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      // Set token in headers for this request
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      // TODO: Add a dedicated /api/auth/me endpoint in backend to verify token
      // For now, we'll extract user data from the token (not ideal but works)
      // In production, always verify tokens server-side

      const tokenData = parseJWT(storedToken);

      if (tokenData && tokenData.exp * 1000 > Date.now()) {
        setUser({
          id: tokenData.id,
          name: tokenData.name,
          email: tokenData.email,
          role: tokenData.role,
        });
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Token expired
        handleLogout();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  /**
   * Parse JWT token (client-side only for reading claims)
   * WARNING: Never trust client-side JWT parsing for security decisions
   */
  function parseJWT(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  }

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async function login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error("Login failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      throw new Error(errorMessage);
    }
  }

  /**
   * Register new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {string} role - "user" or "author"
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async function register(name, email, password, role = "user") {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      return {
        success: true,
        message: response.data.message || "User registered successfully",
      };
    } catch (error) {
      console.error("Registration failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed. Please try again.";

      throw new Error(errorMessage);
    }
  }

  /**
   * Logout user
   */
  function logout() {
    handleLogout();
  }

  /**
   * Internal logout handler
   */
  function handleLogout() {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }

  /**
   * Update user data in context (useful after role changes)
   * @param {Object} updatedUser
   */
  function updateUser(updatedUser) {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser,
    }));
  }

  // =============== USER MANAGEMENT FUNCTIONS (Admin/User) ===============

  /**
   * Get all users (Admin only)
   * @returns {Promise<Array>}
   */
  async function getAllUsers() {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }

  /**
   * Get user by ID (Admin only)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async function getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  }

  /**
   * Delete user (Admin only)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async function deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  }

  /**
   * Update user role (Admin only)
   * @param {string} userId
   * @param {string} role - "user", "author", or "admin"
   * @returns {Promise<Object>}
   */
  async function updateUserRole(userId, role) {
    try {
      const response = await api.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error("Failed to update user role:", error);
      throw error;
    }
  }

  /**
   * Upgrade current user to author (User self-service)
   * @returns {Promise<Object>}
   */
  async function upgradeToAuthor() {
    try {
      const response = await api.put("/users/me/upgrade-to-author");

      // Update local user context
      if (response.data.user) {
        updateUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error("Failed to upgrade to author:", error);
      throw error;
    }
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    // User management functions
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
    upgradeToAuthor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
