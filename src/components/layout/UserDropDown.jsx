import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { LogOut } from "lucide-react";
import { Shield } from "lucide-react";
import RoleGuard from "../auth/RoleGuard";
import { FileText } from "lucide-react";
import { Users } from "lucide-react";
import UpgradeToAuthorButton from "../user/UpgradeToAuthorButton";

function UserDropdown() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-1 pt-1">
                <Shield className="h-3 w-3" />
                <span className="text-xs font-semibold capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Author/Admin Menu Items */}
          <RoleGuard allowedRoles={["author", "admin"]}>
            <DropdownMenuItem asChild>
              <Link to="/articles/my-articles" className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                My Articles
              </Link>
            </DropdownMenuItem>
          </RoleGuard>

          {/* Admin Menu Items */}
          <RoleGuard allowedRoles={["admin"]}>
            <DropdownMenuItem asChild>
              <Link to="/admin/review-queue" className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Review Queue
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </DropdownMenuItem>
          </RoleGuard>

          {/* User Menu Item - Upgrade to Author */}
          <RoleGuard allowedRoles={["user"]}>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <UpgradeToAuthorButton
                variant="ghost"
                size="sm"
                onSuccess={() => {
                  // Optionally navigate or show success message
                  navigate("/articles/my-articles");
                }}
              />
            </DropdownMenuItem>
          </RoleGuard>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 dark:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default UserDropdown;
