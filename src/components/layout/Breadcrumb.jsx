import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumb - Navigation breadcrumb trail
 * Automatically generates breadcrumbs based on current route
 */
export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumb on home page
  if (pathnames.length === 0) return null;

  // Map path segments to human-readable names
  const formatBreadcrumbName = (segment) => {
    // Special cases
    const specialCases = {
      "my-articles": "My Articles",
      "review-queue": "Review Queue",
      "admin": "Admin",
      "articles": "Articles",
      "users": "Users",
    };

    if (specialCases[segment]) {
      return specialCases[segment];
    }

    // Format slug or id into title case
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Build breadcrumb path
  const breadcrumbs = pathnames.map((segment, index) => {
    const path = `/${pathnames.slice(0, index + 1).join("/")}`;
    const isLast = index === pathnames.length - 1;
    const name = formatBreadcrumbName(segment);

    return {
      path,
      name,
      isLast,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b bg-muted/50 px-4 py-2"
    >
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
        {breadcrumbs.map((breadcrumb, index) => (
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
