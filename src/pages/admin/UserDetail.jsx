import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useArticles } from "../../hooks/useArticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  FileText,
  UserCog,
  Trash2,
} from "lucide-react";
import RoleAssignmentDialog from "../../components/admin/RoleAssignmentDialog";
import StatusBadge from "../../components/article/StatusBadge";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, deleteUser, user: currentUser } = useAuth();
  const { getMyArticles } = useArticles();
  const [user, setUser] = useState(null);
  const [userArticles, setUserArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getUserById(id);
      setUser(userData);

      // Fetch user's articles if they are an author/admin
      if (userData.role === "author" || userData.role === "admin") {
        try {
          // Note: This will need backend support to get articles by user ID
          // For now, we'll show a placeholder
          setUserArticles([]);
        } catch (err) {
          console.log("Could not fetch user articles:", err);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setError(error.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const handleDelete = async () => {
    if (user._id === currentUser?.id) {
      alert("You cannot delete your own account");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(user._id);
      alert("User deleted successfully");
      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-600 dark:text-red-400 text-xl font-semibold">
                Error Loading User
              </div>
              <p className="text-muted-foreground">{error || "User not found"}</p>
              <Button onClick={() => navigate("/admin/users")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        {user._id !== currentUser?.id && (
          <div className="flex gap-2">
            <RoleAssignmentDialog
              user={user}
              onSuccess={fetchUserData}
            />
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </div>
        )}
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6" />
                {user.name}
                {user._id === currentUser?.id && (
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-md">
                    You
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                User Details and Activity
              </CardDescription>
            </div>
            <span
              className={`text-sm px-3 py-1 rounded-md font-medium flex items-center gap-1 ${getRoleBadgeColor(user.role)}`}
            >
              <Shield className="h-4 w-4" />
              {user.role.toUpperCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {user.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Articles (if author/admin) */}
      {(user.role === "author" || user.role === "admin") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Articles
            </CardTitle>
            <CardDescription>
              Articles created by this user
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userArticles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No articles found</p>
                <p className="text-sm">This feature requires backend support for fetching articles by user ID</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userArticles.map((article) => (
                  <div
                    key={article._id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div>
                      <Link
                        to={`/articles/${article.slug}`}
                        className="font-medium hover:underline"
                      >
                        {article.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={article.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
