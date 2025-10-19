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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";
import { UserCog, Loader2, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * RoleAssignmentDialog - Dialog to change user roles (Admin only)
 *
 * @param {Object} props
 * @param {Object} props.user - User object to update
 * @param {Function} props.onSuccess - Callback after successful role update
 */
export default function RoleAssignmentDialog({ user, onSuccess }) {
  const { updateUserRole, user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [error, setError] = useState("");

  const roles = [
    { value: "user", label: "User", description: "Can view and read articles" },
    {
      value: "author",
      label: "Author",
      description: "Can create and manage own articles",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Full access to all features and user management",
    },
  ];

  const handleUpdateRole = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (selectedRole === user.role) {
      setError("User already has this role");
      return;
    }

    // Prevent changing own role
    if (user._id === currentUser?.id) {
      setError("You cannot change your own role");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await updateUserRole(user._id, selectedRole);

      console.log("Role updated successfully");

      setOpen(false);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update role. You may have hit the rate limit (3 per hour)."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      // Reset form when closing
      setSelectedRole(user.role);
      setError("");
    }
    setOpen(newOpen);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "author":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "user":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserCog className="h-4 w-4" />
          Change Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for <strong>{user.name}</strong> ({user.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Role */}
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-1">Current Role</p>
            <span
              className={`text-xs px-2 py-1 rounded-md font-medium inline-flex items-center gap-1 ${getRoleBadgeColor(user.role)}`}
            >
              <Shield className="h-3 w-3" />
              {user.role.toUpperCase()}
            </span>
          </div>

          {/* Role Selection */}
          <Field>
            <FieldLabel htmlFor="role">New Role *</FieldLabel>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role" disabled={isLoading}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {role.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Choose the new role for this user. This will update their permissions
              immediately.
            </FieldDescription>
            {error && <FieldError>{error}</FieldError>}
          </Field>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Note:</strong> Role changes take effect immediately. Admins
              have full access to all features. Authors can create and manage
              articles. Users can only view approved content.
            </p>
          </div>

          {/* Rate Limit Warning */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Rate Limit:</strong> You can change roles 3 times per hour.
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
            onClick={(e) => {
              e.preventDefault();
              handleUpdateRole();
            }}
            disabled={isLoading || selectedRole === user.role}
            type="button"
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <UserCog className="h-4 w-4" />
                Update Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
