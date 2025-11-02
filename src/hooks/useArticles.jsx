import { useContext } from "react";
import { ArticleContext } from "../context/ArticleContext";

/**
 * Custom hook to access the Article context
 * @returns {Object} Article context value
 *
 * @property {Array} articles - List of all fetched articles
 * @property {boolean} loading - Whether articles are currently being fetched
 *
 * @property {Function} addArticle - Add a new article
 * @property {Function} updateArticle - Update an existing article
 * @property {Function} deleteArticle - Delete an article by ID
 *
 * @property {Function} getArticleBySlug - Get a single article by its slug
 * @property {Function} getArticleById - Get a single article by its ID
 * @property {Function} getArticlesByTag - Get articles that include a specific tag
 * @property {Function} getFeaturedArticles - Get all featured articles
 * @property {Function} getRelatedArticles - Get related articles based on tags
 * @property {Function} searchArticles - Search articles by keyword
 * @property {Function} getAllTags - Get all unique tags from current articles
 *
 * @property {Function} getMyArticles - Fetch articles created by the logged-in author
 * @property {Function} submitArticleForReview - Submit an article for review (author action)
 * @property {Function} getPendingArticles - Fetch all pending articles (admin only)
 * @property {Function} approveArticle - Approve an article (admin only)
 * @property {Function} rejectArticle - Reject an article (admin only)
 *
 * @property {Function} fetchArticles - Fetch articles from the backend using filters
 *
 * @property {string} searchQuery - Current search term
 * @property {Function} setSearchQuery - Update search term
 * @property {Array<string>} selectedTags - Currently selected tags
 * @property {Function} setSelectedTags - Update selected tags
 * @property {string} sortBy - Current field used for sorting
 * @property {Function} setSortBy - Update sorting field
 * @property {string} sortOrder - Sort order ("asc" or "desc")
 * @property {Function} setSortOrder - Update sort order
 *
 * @property {number} currentPage - Current pagination page
 * @property {Function} setCurrentPage - Set current pagination page
 * @property {number} pageSize - Number of items per page
 * @property {Function} setPageSize - Set page size
 * @property {Object} pagination - Pagination metadata
 * @property {number} pagination.currentPage - Current page index
 * @property {number} pagination.totalPages - Total number of pages
 * @property {number} pagination.totalItems - Total number of articles
 * @property {number} pagination.itemsPerPage - Number of items per page
 * @property {boolean} pagination.hasNextPage - Whether a next page exists
 * @property {boolean} pagination.hasPrevPage - Whether a previous page exists
 *
 * @property {boolean} featuredOnly - Whether to show featured articles only
 * @property {Function} setFeaturedOnly - Toggle featured filter
 * @property {string} authorFilter - Filter by author name or ID
 * @property {Function} setAuthorFilter - Set author filter
 * @property {string} startDate - Start date filter
 * @property {Function} setStartDate - Set start date filter
 * @property {string} endDate - End date filter
 * @property {Function} setEndDate - Set end date filter
 * @property {string} statusFilter - Filter by article status ("all", "draft", "pending", etc.)
 * @property {Function} setStatusFilter - Set status filter
 *
 * @property {Function} clearAllFilters - Reset all search and filter options
 */

export function useArticles() {
  const context = useContext(ArticleContext);

  if (!context) {
    throw new Error("useArticles must be used within an ArticleProvider");
  }

  return context;
}
