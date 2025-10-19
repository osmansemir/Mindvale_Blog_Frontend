import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Spinner - Loading spinner component
 *
 * @param {Object} props
 * @param {string} props.size - Size variant: "sm", "md", "lg" (default: "md")
 * @param {string} props.className - Additional CSS classes
 */
export function Spinner({ size = "md", className, ...props }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin", sizeClasses[size], className)}
      {...props}
    />
  );
}

/**
 * PageSpinner - Full page loading spinner
 */
export function PageSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Spinner size="lg" className="mx-auto text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
