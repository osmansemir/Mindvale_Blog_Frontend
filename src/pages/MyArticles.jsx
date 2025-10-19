import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../hooks/useArticles";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import StatusBadge from "../components/article/StatusBadge";
import SubmitReviewButton from "../components/article/SubmitReviewButton";
import { Pen, Trash2, FileText, AlertCircle } from "lucide-react";
import AlertAction from "../components/article/AlertAction";

export default function MyArticles() {
  const { getMyArticles, deleteArticle } = useArticles();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const statusFilter = filter === "all" ? null : filter;
      const data = await getMyArticles(statusFilter);
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      // Refresh the list
      fetchArticles();
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const filterTabs = [
    { value: "all", label: "All" },
    { value: "draft", label: "Drafts" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading your articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Articles</h1>
          <p className="text-muted-foreground">
            Manage your articles and track their status
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/articles/new">
            <FileText className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              filter === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {filter === "all"
                ? "You haven't created any articles yet."
                : `You don't have any ${filter} articles.`}
            </p>
            <Button asChild>
              <Link to="/admin/articles/new">Create Your First Article</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article._id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <StatusBadge status={article.status} />
                    </div>
                    <CardDescription>{article.description}</CardDescription>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {article.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-secondary rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Metadata */}
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Created: {new Date(article.createdAt).toLocaleDateString()}</p>
                    {article.submittedAt && (
                      <p>Submitted: {new Date(article.submittedAt).toLocaleDateString()}</p>
                    )}
                    {article.reviewedAt && (
                      <p>
                        Reviewed: {new Date(article.reviewedAt).toLocaleDateString()}
                        {article.reviewedBy && ` by ${article.reviewedBy.name}`}
                      </p>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {article.status === "rejected" && article.rejectionReason && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex gap-2 items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-red-900 dark:text-red-300">
                            Feedback from reviewer:
                          </p>
                          <p className="text-sm text-red-800 dark:text-red-400 mt-1">
                            {article.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {/* View/Edit Button */}
                    {article.status === "draft" || article.status === "rejected" ? (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/admin/articles/edit/${article._id}`}>
                          <Pen className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/articles/${article.slug}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    )}

                    {/* Submit for Review Button */}
                    {(article.status === "draft" || article.status === "rejected") && (
                      <SubmitReviewButton
                        articleId={article._id}
                        status={article.status}
                        onSuccess={fetchArticles}
                      />
                    )}

                    {/* Delete Button */}
                    <AlertAction
                      onConfirm={() => handleDelete(article._id)}
                      title="Delete Article"
                      description="Are you sure you want to delete this article? This action cannot be undone."
                    >
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertAction>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
