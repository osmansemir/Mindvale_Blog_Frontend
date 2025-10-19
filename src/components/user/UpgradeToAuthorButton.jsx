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
import { ArrowUpCircle, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * UpgradeToAuthorButton - Button for users to upgrade their account to author
 *
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback after successful upgrade (optional)
 * @param {string} props.variant - Button variant (default: "default")
 * @param {string} props.size - Button size (default: "default")
 */
export default function UpgradeToAuthorButton({
  onSuccess,
  variant = "default",
  size = "default",
}) {
  const { upgradeToAuthor, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  // Only show for users with role="user"
  if (!user || user.role !== "user") {
    return null;
  }

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await upgradeToAuthor();

      console.log("Upgraded to author successfully", result);

      setOpen(false);

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Failed to upgrade to author:", error);
      setError(
        error.response?.data?.message ||
          "Failed to upgrade account. You may have hit the rate limit (3 per hour)."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      // Reset error when closing
      setError("");
    }
    setOpen(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <ArrowUpCircle className="h-4 w-4" />
          Become an Author
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5" />
            Upgrade to Author
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Become an author and unlock the ability to create and publish your own
              articles!
            </p>

            <div className="bg-muted p-4 rounded-md space-y-2">
              <p className="font-medium text-foreground">As an author, you'll be able to:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Create and write articles</li>
                <li>Submit articles for admin review</li>
                <li>Manage your published content</li>
                <li>Edit and update your articles</li>
                <li>Track article status and feedback</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> This action is permanent and cannot be undone.
                Your account will immediately gain author privileges.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleUpgrade();
            }}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Upgrading...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Become an Author
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
