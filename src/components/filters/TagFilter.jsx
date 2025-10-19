import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useArticles } from "../../hooks/useArticles";
import { Badge } from "../ui/badge";

/**
 * TagFilter - Filter articles by tags
 */
export default function TagFilter() {
  const { selectedTags, setSelectedTags, getAllTags } = useArticles();
  const allTags = getAllTags();

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  if (allTags.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllTags}
            className="h-auto p-0 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {isSelected && <X className="ml-1 h-3 w-3" />}
            </Badge>
          );
        })}
      </div>
      {selectedTags.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
