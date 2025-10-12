// src/context/ArticleContext.jsx
import { createContext, useState } from "react";
import { mockArticles } from "../utils/mockData";

// Create the context
export const ArticleContext = createContext();

// Provider component
export function ArticleProvider({ children }) {
  const [articles, setArticles] = useState(mockArticles);

  // Add new article
  const addArticle = (newArticle) => {
    setArticles([...articles, newArticle]);
  };

  // Update existing articleexport
  const updateArticle = (id, updatedData) => {
    setArticles(
      articles.map((article) =>
        article.id === id ? { ...article, ...updatedData } : article,
      ),
    );
  };

  // Delete article
  const deleteArticle = (slug) => {
    setArticles(articles.filter((article) => article.slug !== slug));
  };

  // Get single article by slug
  const getArticleBySlug = (slug) => {
    return articles.find((article) => article.slug === slug);
  };

  // Get articles by tag
  const getArticlesByTag = (tag) => {
    return articles.filter((article) =>
      article.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );
  };

  // Get articles by ID
  const getArticlesById = (id) => {
    return articles.find((article) => article.id === id);
  };

  // Get featured articles
  const getFeaturedArticles = () => {
    return articles.filter((article) => article.featured);
  };

  // Get related articles (with scored and sorted matching)
  function getRelatedArticles(currentArticle, limit = 4) {
    const currentTags = new Set(currentArticle.tags);
    const articlesWithScores = mockArticles
      .filter((article) => article.id !== currentArticle.id) // Exclude the current article
      .map((article) => {
        const sharedTags = article.tags.filter((tag) => currentTags.has(tag));
        return { ...article, score: sharedTags.length };
      })
      .filter((article) => article.score > 0); // Only include articles with at least one shared tag

    // Sort by score (descending) and then by date (descending) as a tie-breaker
    return articlesWithScores
      .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  // Search articles by title or description
  const searchArticles = (query) => {
    const lowerQuery = query.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  };

  // Get all unique tags
  const getAllTags = () => {
    const tagSet = new Set();
    articles.forEach((article) => {
      article.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  };

  // Context value with all functions
  const value = {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticleBySlug,
    getArticlesByTag,
    getFeaturedArticles,
    getRelatedArticles,
    searchArticles,
    getAllTags,
    getArticlesById,
  };

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
}
