import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "../ModeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import RoleGuard from "../auth/RoleGuard";
import { Button } from "../ui/button";
import { User, LogOut, Shield, FileText, UserPlus, Users } from "lucide-react";
import UpgradeToAuthorButton from "../user/UpgradeToAuthorButton";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center px-3 sticky top-0 z-10 h-18 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex justify-between px-4 items-center w-full md:w-2xl">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Show for authenticated authors/admins only */}
            <RoleGuard allowedRoles={["author", "admin"]}>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin/articles/new">New Article</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </RoleGuard>

            {/* Show for admins only */}
            <RoleGuard allowedRoles={["admin"]}>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin">Admin</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </RoleGuard>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Show login/register buttons when not authenticated */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          ) : (
            /* Show user dropdown when authenticated */
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
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
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
                    <Link to="/my-articles" className="cursor-pointer">
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
                        navigate("/my-articles");
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
