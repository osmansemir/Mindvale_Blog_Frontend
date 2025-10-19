import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useArticles } from "../../hooks/useArticles";
import { FileText } from "lucide-react";

/**
 * RelatedArticles - Display related articles based on tags
 *
 * @param {Object} props
 * @param {Object} props.currentArticle - Current article object
 * @param {number} props.limit - Maximum number of related articles to show (default: 3)
 */
export default function RelatedArticles({ currentArticle, limit = 3 }) {
  const { getRelatedArticles } = useArticles();

  if (!currentArticle) return null;

  const relatedArticles = getRelatedArticles(currentArticle, limit);

  if (relatedArticles.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedArticles.map((article) => (
          <Card key={article._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base line-clamp-2">
                <Link
                  to={`/articles/${article.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {article.title}
                </Link>
              </CardTitle>
              {article.description && (
                <CardDescription className="line-clamp-2">
                  {article.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Author */}
                {article.author && (
                  <p className="text-xs text-muted-foreground">
                    By {article.author.name || "Unknown"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
