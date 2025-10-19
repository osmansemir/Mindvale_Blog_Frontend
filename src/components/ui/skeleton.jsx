import { cn } from "../../lib/utils";

/**
 * Skeleton - Loading placeholder component
 * Shows animated shimmer effect while content is loading
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
