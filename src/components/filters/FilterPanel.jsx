import { useState, useEffect, useRef } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useArticles } from "@/hooks/useArticles";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/DatePicker";
import { useBreakpoints } from "@/hooks/useBreakpoints";

/**
 * FilterPanel - Advanced filtering options for articles
 * Supports: featured, author, date range, status (admin only)
 */
export default function FilterPanel() {
  const { user } = useAuth();
  const breakpoint = useBreakpoints();

  useEffect(() => console.log("breakpoint", breakpoint), [breakpoint]);

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
    <div className="border shadow-xs h-9 text-sm rounded-lg p-0 relative flex items-center w-16 md:flex-1">
      {/* Filter panel trigger */}
      <Popover>
        <PopoverTrigger className="flex items-center  h-full gap-2 justify-around w-full">
          <Filter className="size-4 ml-2 sm:mx-2 align-center" />
          {breakpoint !== "zero" && breakpoint !== "sm" && (
            <div className="flex-grow text-left align-bottom">Filters</div>
          )}
          <ChevronDown className="size-4 mx-2" />
          {hasActiveFilters && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              className="size-7 mx-1 text-xs"
            >
              <X name="Clear all" className="size-4" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-4 sm:w-80 w-40">
          {/* Featured Filter */}
          <div className="flex gap-2">
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
          <Separator />
          {/* Author Filter */}
          <div className="space-y-2">
            <Label htmlFor="autor">Author</Label>
            <Input
              id="author"
              type="text"
              placeholder="Enter author name..."
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="h-8 placeholder:text-sm "
            />
            {authorFilter && (
              <p className="text-xs text-muted-foreground">
                Filtering by: {authorFilter}
              </p>
            )}
          </div>
          <Separator />
          {/* Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="Date" className="text-sm font-medium">
              Date
            </Label>
            <DatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              range={{ from: startDate, to: endDate }}
              id="date"
              value={startDate}
            />
          </div>
          {/* Status Filter */}
          {user && user.role === "admin" && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status" className="h-8">
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
            </>
          )}
          <Separator />
          <Button disabled={!hasActiveFilters} onClick={handleClearAll}>
            Clear All
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
