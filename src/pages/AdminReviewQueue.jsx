import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../hooks/useArticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import StatusBadge from "../components/article/StatusBadge";
import ApproveButton from "../components/admin/ApproveButton";
import RejectDialog from "../components/admin/RejectDialog";
import { FileText, User, Calendar, Eye } from "lucide-react";

export default function AdminReviewQueue() {
  const { getPendingArticles } = useArticles();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingArticles = async () => {
    setLoading(true);
    try {
      const data = await getPendingArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch pending articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const handleReviewAction = () => {
    // Refresh the list after approve/reject
    fetchPendingArticles();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading pending articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground">
          Articles waiting for your review ({articles.length} pending)
        </p>
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending articles</h3>
            <p className="text-muted-foreground text-center">
              All articles have been reviewed. Check back later for new submissions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article._id} className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <StatusBadge status={article.status} />
                    </div>
                    <CardDescription className="text-base">
                      {article.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {article.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-secondary rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    {/* Author */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-foreground">
                          {article.author?.name || "Unknown Author"}
                        </p>
                        <p className="text-xs">{article.author?.email}</p>
                      </div>
                    </div>

                    {/* Submission Date */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-foreground">Submitted</p>
                        <p className="text-xs">
                          {article.submittedAt
                            ? new Date(article.submittedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-foreground">Created</p>
                        <p className="text-xs">
                          {new Date(article.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Article Preview */}
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.markdown?.substring(0, 200)}...
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {/* View Full Article */}
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/articles/${article.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Link>
                    </Button>

                    {/* Approve Button */}
                    <ApproveButton
                      articleId={article._id}
                      articleTitle={article.title}
                      onSuccess={handleReviewAction}
                    />

                    {/* Reject Dialog */}
                    <RejectDialog
                      articleId={article._id}
                      articleTitle={article.title}
                      onSuccess={handleReviewAction}
                    />
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
