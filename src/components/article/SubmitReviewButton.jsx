import { useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Send, Loader2 } from "lucide-react";
import { useArticles } from "../../hooks/useArticles";

/**
 * SubmitReviewButton - Button to submit article for admin review
 *
 * @param {Object} props
 * @param {string} props.articleId - Article ID
 * @param {string} props.status - Current article status
 * @param {Function} props.onSuccess - Callback after successful submission
 */
export default function SubmitReviewButton({ articleId, status, onSuccess }) {
  const { submitArticleForReview } = useArticles();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Only show for draft or rejected articles
  if (status !== "draft" && status !== "rejected") {
    return null;
  }

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await submitArticleForReview(articleId);

      // Show success (you can add toast notification here)
      console.log("Article submitted for review successfully");

      setOpen(false);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to submit article:", error);
      // You can add error toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Send className="h-4 w-4" />
          Submit for Review
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Article for Review?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Your article will be sent to administrators for review. Once
              submitted:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>You won't be able to edit it until reviewed</li>
              <li>An admin will approve or request changes</li>
              <li>You'll receive feedback if changes are needed</li>
            </ul>
            <p className="pt-2 font-medium">
              Make sure your article is ready for review!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
