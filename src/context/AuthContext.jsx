import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

//eslint-disable-next-line
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []); //eslint-disable-line

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

      // ✅ Verify token with server
      const res = await api.get("/auth/me"); // must exist in your backend

      setUser(res.data.user);
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      handleLogout();
    } finally {
      setLoading(false);
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
      console.error("Sign In failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Sign In failed. Please check your credentials.";

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
        message: response.data.message || "User Signed Up successfully",
      };
    } catch (error) {
      console.error("Sign Up failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Sign Up failed. Please try again.";

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
    setIsAuthenticated,
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
