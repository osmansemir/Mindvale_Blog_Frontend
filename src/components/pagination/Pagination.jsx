import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";
import { useArticles } from "../../hooks/useArticles";

/**
 * Pagination - Paginated navigation component
 */
export default function Pagination() {
  const { pagination, currentPage, setCurrentPage } = useArticles();

  const { totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* First Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(1)}
        disabled={!hasPrevPage}
        className="hidden sm:flex"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              className="hidden md:flex"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2 flex items-center">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 flex items-center">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              className="hidden md:flex"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      {/* Next Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(totalPages)}
        disabled={!hasNextPage}
        className="hidden sm:flex"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
