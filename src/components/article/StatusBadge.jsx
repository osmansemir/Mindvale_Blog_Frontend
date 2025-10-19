import { cn } from "../../lib/utils";

/**
 * StatusBadge - Visual badge for article status
 *
 * @param {Object} props
 * @param {string} props.status - Article status (draft, pending, approved, rejected)
 * @param {string} props.className - Additional CSS classes
 */
export default function StatusBadge({ status, className }) {
  const statusConfig = {
    draft: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: "📝",
    },
    pending: {
      label: "Pending Review",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: "⏳",
    },
    approved: {
      label: "Approved",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: "✅",
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: "❌",
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
