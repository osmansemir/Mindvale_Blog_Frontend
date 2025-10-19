import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Field, FieldLabel, FieldError, FieldDescription } from "../ui/field";
import { XCircle, Loader2 } from "lucide-react";
import { useArticles } from "../../hooks/useArticles";
import { toast } from "sonner";

/**
 * RejectDialog - Dialog to reject an article with feedback (Admin only)
 *
 * @param {Object} props
 * @param {string} props.articleId - Article ID
 * @param {string} props.articleTitle - Article title (for confirmation)
 * @param {Function} props.onSuccess - Callback after successful rejection
 */
export default function RejectDialog({ articleId, articleTitle, onSuccess }) {
  const { rejectArticle } = useArticles();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleReject = async () => {
    // Validate reason (10-500 characters as per backend)
    if (!reason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    if (reason.length < 10) {
      setError("Reason must be at least 10 characters");
      return;
    }

    if (reason.length > 500) {
      setError("Reason must not exceed 500 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await rejectArticle(articleId, reason);

      toast.success(`Article "${articleTitle}" has been rejected. Feedback sent to author.`);

      // Reset form
      setReason("");
      setOpen(false);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to reject article:", error);
      setError(error.response?.data?.message || "Failed to reject article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      // Reset form when closing
      setReason("");
      setError("");
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Reject Article</DialogTitle>
          <DialogDescription>
            Article: <strong>"{articleTitle}"</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Field>
            <FieldLabel htmlFor="reason">Rejection Reason *</FieldLabel>
            <Textarea
              id="reason"
              placeholder="Explain what needs to be fixed or improved..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(""); // Clear error on change
              }}
              disabled={isLoading}
              rows={6}
              className={error ? "border-red-500" : ""}
            />
            <FieldDescription>
              {reason.length}/500 characters (minimum 10 required)
            </FieldDescription>
            {error && <FieldError>{error}</FieldError>}
          </Field>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Note:</strong> The author will see this feedback and can
              revise their article based on your comments.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleReject();
            }}
            disabled={isLoading || !reason.trim()}
            className="gap-2"
            type="button"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Reject Article
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
