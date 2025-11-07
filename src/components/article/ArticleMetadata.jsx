import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

/**
 * ArticleMetadata - Display article metadata (dates, author, review info)
 *
 * @param {Object} props
 * @param {Object} props.article - Article object
 */
export default function ArticleMetadata({ article }) {
  const { user } = useAuth();
  if (!article) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border-t border-b py-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Creation Date */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <div>
            <span className="font-medium text-foreground">Published: </span>
            {formatDate(article.createdAt)}
          </div>
        </div>

        {/* Last Updated */}
        {article.updatedAt && article.updatedAt !== article.createdAt && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <div>
              <span className="font-medium text-foreground">Updated: </span>
              {formatDate(article.updatedAt)}
            </div>
          </div>
        )}

        {/* Submission Date (for pending articles) */}
        {user?.role === "admin" && article.submittedAt && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <div>
              <span className="font-medium text-foreground">Submitted: </span>
              {formatDateTime(article.submittedAt)}
            </div>
          </div>
        )}

        {/* Review Info (for approved/rejected articles) */}
        {user?.role === "admin" && article.reviewedAt && (
          <div className="flex items-center gap-2 text-muted-foreground">
            {article.status === "approved" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <div>
              <span className="font-medium text-foreground">
                {article.status === "approved" ? "Approved" : "Rejected"}:{" "}
              </span>
              {formatDateTime(article.reviewedAt)}
              {article.reviewedBy && ` by ${article.reviewedBy.name}`}
            </div>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="md:col-span-2 flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground">Tags:</span>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
