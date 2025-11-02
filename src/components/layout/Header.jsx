import { useState } from "react";
import { ModeToggle } from "../ModeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import RoleGuard from "../auth/RoleGuard";
import { Button } from "../ui/button";
import {
  User,
  LogOut,
  Shield,
  FileText,
  Users,
  Menu,
  Home,
  PenSquare,
} from "lucide-react";
import UpgradeToAuthorButton from "../user/UpgradeToAuthorButton";
import { Separator } from "../ui/separator";
import UserDropdown from "./UserDropDown";
import { PencilLine } from "lucide-react";
import { Earth } from "lucide-react";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
    setMobileMenuOpen(false);
  };

  // const closeMobileMenu = () => {
  //   setMobileMenuOpen(false);
  // };

  return (
    <div className="flex items-center px-14 sticky top-0 z-10 h-24 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex gap-4  justify-between items-center w-full ">
        <div className=" flex gap-4">
          <Link to="/">
            <Earth />
          </Link>
        </div>
        <div className="flex items-center gap-4 justify-self-end">
          <RoleGuard allowedRoles={["author", "admin"]}>
            <Link className="" to="/articles/new">
              <Button className="font-bold">
                <PencilLine />
                Write
              </Button>
            </Link>
          </RoleGuard>
          <ModeToggle />
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <UserDropdown />
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
