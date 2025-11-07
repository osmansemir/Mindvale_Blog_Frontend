import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useArticles } from "../../hooks/useArticles";

/**
 * SearchBar - Search input with debouncing
 */
export default function SearchBar() {
  const { searchQuery, setSearchQuery, pagination } = useArticles();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="relative flex-grow md:flex-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles by title, description, or tags..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <p className="text-sm text-muted-foreground mt-2">
          Found {pagination.totalItems} result
          {pagination.totalItems !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
