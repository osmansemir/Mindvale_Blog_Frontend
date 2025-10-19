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
import { CheckCircle, Loader2 } from "lucide-react";
import { useArticles } from "../../hooks/useArticles";
import { toast } from "sonner";

/**
 * ApproveButton - Button to approve an article (Admin only)
 *
 * @param {Object} props
 * @param {string} props.articleId - Article ID
 * @param {string} props.articleTitle - Article title (for confirmation dialog)
 * @param {Function} props.onSuccess - Callback after successful approval
 */
export default function ApproveButton({ articleId, articleTitle, onSuccess }) {
  const { approveArticle } = useArticles();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);

    try {
      await approveArticle(articleId);

      toast.success(`Article "${articleTitle}" has been approved successfully!`);

      setOpen(false);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to approve article:", error);
      // Error toast is handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4" />
          Approve
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Article?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              You are about to approve: <strong>"{articleTitle}"</strong>
            </p>
            <p>
              Once approved, this article will be publicly visible to all users.
              The author will be notified of the approval.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleApprove();
            }}
            disabled={isLoading}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Approve
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
