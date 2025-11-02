import axios from "axios";
import { toast } from "sonner";

// const API_URL = "http://192.168.0.169:5000/api";
const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL, //  backend URL
});

// Request interceptor - Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad Request - Validation errors
          if (import.meta.env.DEV) {
            console.error("Validation error:", data);
          }
          // Show first validation error if available
          if (
            data.errors &&
            Array.isArray(data.errors) &&
            data.errors.length > 0
          ) {
            toast.error(data.errors[0].message || "Validation error");
          } else if (data.message) {
            toast.error(data.message);
          }
          break;

        case 401:
          // Unauthorized - Invalid or expired token
          if (import.meta.env.DEV) {
            console.error("Unauthorized: Invalid or expired token");
          }

          toast.error("Session expired. Please Sign In again.");

          // Clear token and redirect to login
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];

          // Redirect to login page if not already there
          if (
            window.location.pathname !== "/sign-in" &&
            window.location.pathname !== "/sign-up"
          ) {
            setTimeout(() => {
              window.location.href = "/sign-in";
            }, 1000);
          }
          break;

        case 403:
          // Forbidden - Insufficient permissions
          if (import.meta.env.DEV) {
            console.error("Forbidden: Insufficient permissions");
          }
          toast.error(
            "Access denied. You don't have permission to perform this action.",
          );
          break;

        case 404:
          // Not found
          if (import.meta.env.DEV) {
            console.error("Not found:", data.message || "Resource not found");
          }
          toast.error(data.message || "Resource not found");
          break;

        case 429: {
          // Rate limit exceeded
          const retryAfter = error.response.headers["retry-after"];
          const retryMessage = retryAfter
            ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
            : "Rate limit exceeded. Please try again later.";

          if (import.meta.env.DEV) {
            console.error(retryMessage);
          }

          toast.warning(retryMessage, {
            duration: 5000,
          });
          break;
        }

        case 500:
          // Internal server error
          if (import.meta.env.DEV) {
            console.error(
              "Server error:",
              data.message || "Internal server error",
            );
          }
          toast.error("Server error. Please try again later.");
          break;

        default:
          if (import.meta.env.DEV) {
            console.error("API Error:", data.message || "An error occurred");
          }
          toast.error(data.message || "An unexpected error occurred");
      }
    } else if (error.request) {
      // Request was made but no response received
      if (import.meta.env.DEV) {
        console.error("Network error: No response from server");
      }
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      if (import.meta.env.DEV) {
        console.error("Error:", error.message);
      }
      toast.error(error.message || "An unexpected error occurred");
    }

    return Promise.reject(error);
  },
);

export default api;
