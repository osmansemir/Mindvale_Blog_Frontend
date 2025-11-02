import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import api from "../../api/axios";

/**
 * FeaturedArticles - Display featured articles in a hero section
 * Fetches featured articles separately from main article list
 */
export default function FeaturedArticles() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const res = await api.get("/articles?featured=true&limit=3");
        const articlesData = res.data.data || res.data;
        setFeaturedArticles(Array.isArray(articlesData) ? articlesData : []);
      } catch (error) {
        console.error("Failed to fetch featured articles:", error);
        setFeaturedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          <h2 className="text-3xl font-bold">Featured Articles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // if (featuredArticles.length === 0) {
  //   return null; // Don't show section if no featured articles
  // }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        <h2 className="text-3xl font-bold">Featured Articles</h2>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredArticles.map((article) => (
          <Card
            key={article._id}
            className="group hover:shadow-lg transition-shadow duration-300 border-2 border-yellow-500/20 hover:border-yellow-500/40"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                </CardTitle>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              </div>
              <CardDescription className="line-clamp-3">
                {article.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                {article.author && (
                  <span className="font-medium">{article.author.name}</span>
                )}
              </div>

              {/* Read More Button */}
              <Button asChild variant="outline" className="w-full group">
                <Link to={`/articles/${article.slug}`}>
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
