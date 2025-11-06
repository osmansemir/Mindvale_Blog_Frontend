import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // Adjust import path to your auth context

/**
 * Breadcrumb configuration - defines the actual navigation hierarchy
 * This maps routes to their parent paths, not just URL segments
 */
const breadcrumbConfig = {
  // Articles
  "/articles": {
    label: "Articles",
    parent: null,
  },
  "/articles/my-articles": {
    label: "My Articles",
    parent: "dashboard", // special case - determined by user role
  },

  // Admin Dashboard
  "/admin": {
    label: "Admin Dashboard",
    parent: null,
  },
  "/admin/review-queue": {
    label: "Review Queue",
    parent: "/admin",
  },
  "/admin/users": {
    label: "Users",
    parent: "/admin",
  },

  // Author Dashboard
  "/dashboard": {
    label: "Dashboard",
    parent: null,
  },

  // Users
  "/users": {
    label: "Users",
    parent: "/admin",
  },
};

/**
 * Breadcrumb - Navigation breadcrumb trail
 * Generates breadcrumbs based on configuration and user role
 */
export default function Breadcrumb() {
  const location = useLocation();
  const { user } = useAuth(); // Get user from auth context
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumb on home page
  if (pathnames.length === 0) return null;

  /**
   * Get dashboard path based on user role
   */
  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    return user.role === "admin" ? "/admin" : "/dashboard";
  };

  /**
   * Find matching config for current path
   * Handles both exact matches and dynamic routes (like /articles/:id)
   */
  const findConfig = (pathname) => {
    // Try exact match first
    if (breadcrumbConfig[pathname]) {
      return breadcrumbConfig[pathname];
    }

    // Check if it's a dynamic route (e.g., /articles/some-article-slug)
    const segments = pathname.split("/").filter((x) => x);

    // For /articles/:id pattern
    if (
      segments[0] === "articles" &&
      segments.length === 2 &&
      segments[1] !== "my-articles"
    ) {
      return {
        label: formatBreadcrumbName(segments[1]),
        parent: null, // comes directly from home, skip "Articles" page
      };
    }

    // For /users/:id pattern
    if (segments[0] === "users" && segments.length === 2) {
      return {
        label: "User Info",
        parent: "/admin/users",
      };
    }

    // For /admin/users/:id pattern
    if (
      segments[0] === "admin" &&
      segments[1] === "users" &&
      segments.length === 3
    ) {
      return {
        label: "User Info",
        parent: "/admin/users",
      };
    }

    return null;
  };

  /**
   * Build breadcrumb trail by walking up parent chain
   */
  const buildBreadcrumbs = () => {
    const crumbs = [];
    let currentPath = location.pathname;
    let config = findConfig(currentPath);

    // Current page (last crumb)
    if (config) {
      crumbs.unshift({
        path: currentPath,
        name: config.label,
        isLast: true,
      });

      // Handle special case: determine parent based on user role
      if (config.parent === "dashboard") {
        const dashboardPath = getDashboardPath();
        const parentConfig = breadcrumbConfig[dashboardPath];
        if (parentConfig) {
          crumbs.unshift({
            path: dashboardPath,
            name: parentConfig.label,
            isLast: false,
          });
        }
      } else {
        // Walk up the parent chain normally
        while (config && config.parent && config.parent !== "dashboard") {
          const parentConfig = breadcrumbConfig[config.parent];
          if (parentConfig) {
            crumbs.unshift({
              path: config.parent,
              name: parentConfig.label,
              isLast: false,
            });
            config = parentConfig;
          } else {
            break;
          }
        }
      }
    }

    return crumbs;
  };

  /**
   * Format path segments into human-readable names
   */
  const formatBreadcrumbName = (segment) => {
    // Format slug or id into title case
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbs = buildBreadcrumbs();

  // Don't show breadcrumb if no valid config found
  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="border-b bg-muted/50 px-4 py-2">
      <ol className="flex items-center gap-2 text-sm max-w-4xl mx-auto">
        {/* Home link */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {breadcrumb.isLast ? (
              <span className="font-medium text-foreground">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
