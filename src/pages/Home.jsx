import ArticleList from "../components/article/ArticleList.jsx";
import { useArticles } from "../hooks/useArticles.jsx";
import SearchBar from "../components/search/SearchBar";
import SortDropdown from "../components/sorting/SortDropdown";
import TagFilter from "../components/filters/TagFilter";
import Pagination from "../components/pagination/Pagination";
import { PageSpinner } from "../components/ui/spinner";

function Home() {
  const { articles, loading, pagination } = useArticles();

  return (
    <>
      <main className="overflow-y-auto flex-1 w-full max-w-4xl px-4 mx-auto pt-10">
        <h1 className="text-5xl font-bold mb-8">Articles</h1>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar />
          <SortDropdown />
        </div>

        {/* Tag Filter */}
        <div className="mb-6">
          <TagFilter />
        </div>

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
      </main>
    </>
  );
}
export default Home;
