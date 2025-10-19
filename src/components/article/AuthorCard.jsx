import { User, Mail, Shield } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

/**
 * AuthorCard - Display author information
 *
 * @param {Object} props
 * @param {Object} props.author - Author object with name, email, role
 */
export default function AuthorCard({ author }) {
  if (!author) return null;

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "author":
        return "default";
      case "user":
      default:
        return "secondary";
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {getInitials(author.name)}
              </span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">{author.name}</h3>
              <Badge variant={getRoleBadgeVariant(author.role)}>
                <Shield className="h-3 w-3 mr-1" />
                {author.role}
              </Badge>
            </div>

            {author.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {author.email}
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Article author
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
