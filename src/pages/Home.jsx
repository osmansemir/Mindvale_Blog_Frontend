import ArticleList from "../components/article/ArticleList.jsx";
import { useArticles } from "../hooks/useArticles.jsx";
import SearchBar from "../components/search/SearchBar";
import SortDropdown from "../components/sorting/SortDropdown";
import TagFilter from "../components/filters/TagFilter";
import FilterPanel from "../components/filters/FilterPanel";
import FeaturedArticles from "../components/article/FeaturedArticles";
import Pagination from "../components/pagination/Pagination";
import { PageSpinner } from "../components/ui/spinner";

function Home() {
  const { articles, loading, pagination } = useArticles();

  return (
    <>
      <main className="w-full min-h-screen mx-auto grid grid-cols-3 p-10">
        <div className="col-span-2">
          {/* Featured Articles Section */}
          <FeaturedArticles />

          {/* Search,Sort and Filter Bar */}
          <div className="flex gap-2 mb-6">
            <SearchBar />
            <SortDropdown />
            <FilterPanel />
          </div>

          {/* Advanced Filter Panel */}

          {/* Articles List */}
          {loading ? (
            <PageSpinner message="Loading articles..." />
          ) : (
            <>
              {pagination.totalItems > 0 && (
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {articles.length} of {pagination.totalItems} article
                  {pagination.totalItems !== 1 ? "s" : ""}
                </p>
              )}
              <ArticleList articles={articles} />

              {/* Pagination */}
              <Pagination />
            </>
          )}
        </div>
        <div className="col-span-1">
          {/* Tag Filter */}
          <div className="mb-6">
            <TagFilter />
          </div>
        </div>
      </main>
    </>
  );
}
export default Home;
