import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function MobileHamburger() {
  return (
    <>
      {/* Mobile Menu - Hamburger */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navigate through the blog</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            {/* User Info */}
            {isAuthenticated && user && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">{user.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="h-3 w-3" />
                  <span className="text-xs font-semibold capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            <Separator />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              <Button
                asChild
                variant="ghost"
                className="justify-start"
                onClick={closeMobileMenu}
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>

              <RoleGuard allowedRoles={["author", "admin"]}>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/articles/new">
                    <PenSquare className="mr-2 h-4 w-4" />
                    New Article
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/articles/my-articles">
                    <FileText className="mr-2 h-4 w-4" />
                    My Articles
                  </Link>
                </Button>
              </RoleGuard>

              <RoleGuard allowedRoles={["admin"]}>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/admin/review-queue">
                    <FileText className="mr-2 h-4 w-4" />
                    Review Queue
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link to="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
              </RoleGuard>
            </nav>

            <Separator />

            {/* Auth Actions */}
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" onClick={closeMobileMenu}>
                  <Link to="/sign-in">Login</Link>
                </Button>
                <Button asChild onClick={closeMobileMenu}>
                  <Link to="/sign-up">Register</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <RoleGuard allowedRoles={["user"]}>
                  <UpgradeToAuthorButton
                    variant="outline"
                    className="w-full"
                    onSuccess={() => {
                      closeMobileMenu();
                      navigate("/articles/my-articles");
                    }}
                  />
                </RoleGuard>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MobileHamburger;
