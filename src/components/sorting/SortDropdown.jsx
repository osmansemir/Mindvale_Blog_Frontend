import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useArticles } from "../../hooks/useArticles";

/**
 * SortDropdown - Dropdown to sort articles
 */
export default function SortDropdown() {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useArticles();

  const sortOptions = [
    {
      value: "createdAt-desc",
      label: "Newest First",
      sortBy: "createdAt",
      order: "desc",
    },
    {
      value: "createdAt-asc",
      label: "Oldest First",
      sortBy: "createdAt",
      order: "asc",
    },
    { value: "title-asc", label: "Title A-Z", sortBy: "title", order: "asc" },
    { value: "title-desc", label: "Title Z-A", sortBy: "title", order: "desc" },
  ];

  const currentValue = `${sortBy}-${sortOrder}`;

  const handleChange = (value) => {
    const option = sortOptions.find((opt) => opt.value === value);
    if (option) {
      setSortBy(option.sortBy);
      setSortOrder(option.order);
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
