import { useState, useEffect, useRef } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useArticles } from "../../hooks/useArticles";
import { useAuth } from "../../hooks/useAuth";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

/**
 * FilterPanel - Advanced filtering options for articles
 * Supports: featured, author, date range, status (admin only)
 */
export default function FilterPanel() {
  const { user } = useAuth();
  const {
    featuredOnly,
    setFeaturedOnly,
    authorFilter,
    setAuthorFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    clearAllFilters,
  } = useArticles();

  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const hasActiveFilters =
    featuredOnly ||
    authorFilter ||
    startDate ||
    endDate ||
    statusFilter !== "all";

  const handleClearAll = () => {
    clearAllFilters();
  };

  return (
    <div className="border shadow-xs rounded-lg px-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div className="flex text-sm items-center min-w-41 gap-2">
          <Filter className="size-4" />
          Filters
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filter Options - Collapsible */}
      {isExpanded && (
        <div
          className="space-y-4 p-4 border absolute top-9 right-0 bg-background min-w-58"
          ref={panelRef}
        >
          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featuredOnly}
              onCheckedChange={(checked) => setFeaturedOnly(checked)}
            />
            <Label
              htmlFor="featured"
              className="text-sm font-medium cursor-pointer"
            >
              Show only featured articles
            </Label>
          </div>

          {/* Author Filter */}
          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium">
              Filter by Author
            </Label>
            <Input
              id="author"
              type="text"
              placeholder="Enter author name..."
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="h-9"
            />
            {authorFilter && (
              <p className="text-xs text-muted-foreground">
                Filtering by: {authorFilter}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                From Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                To Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Status Filter - Admin Only */}
          {user && user.role === "admin" && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Filter by Status (Admin)
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="h-9">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
