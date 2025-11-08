import { Scroll } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Hourglass } from "lucide-react";
import { BookOpenCheck } from "lucide-react";
import { BookX } from "lucide-react";

export default function StatusBadge({ status, className }) {
  const statusConfig = {
    draft: {
      label: "Draft",
      variant: "primary",
      icon: <Scroll className="size-3 mr-2" />,
    },
    pending: {
      label: "Pending Review",
      variant: "secondary",
      icon: <Hourglass className="size-3 mr-2" />,
    },
    approved: {
      label: "Approved",
      variant: "success",
      icon: <BookOpenCheck className="size-3 mr-2" />,
    },
    rejected: {
      label: "Rejected",
      variant: "destructive",
      icon: <BookX className="size-3 mr-2" />,
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant={config.variant} className={className}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
