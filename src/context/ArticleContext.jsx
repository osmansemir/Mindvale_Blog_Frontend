import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

// eslint-disable-next-line
export const ArticleContext = createContext();

export function ArticleProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch all articles from the backend when the app loads
  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await api.get("/articles");
        setArticles(res.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // ➕ Add a new article
  const addArticle = async (newArticle) => {
    try {
      const res = await api.post("/articles", newArticle);
      setArticles([...articles, res.data]);
    } catch (error) {
      console.error("Failed to add article:", error);
    }
  };

  // 🔄 Update existing article
  const updateArticle = async (id, updatedData) => {
    try {
      const res = await api.put(`/articles/${id}`, updatedData);
      setArticles(
        articles.map((article) => (article._id === id ? res.data : article)),
      );
    } catch (error) {
      console.error("Failed to update article:", error);
    }
  };

  // ❌ Delete article
  const deleteArticle = async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter((article) => article._id !== id));
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  // 🔍 Get single article by slug
  const getArticleBySlug = (slug) =>
    articles.find((article) => article.slug === slug);

  // 🔍 Get single article by id
  const getArticleById = (id) => articles.find((article) => article._id === id);

  // 🏷 Get articles by tag
  const getArticlesByTag = (tag) =>
    articles.filter((a) =>
      a.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );

  // ⭐ Featured articles
  const getFeaturedArticles = () => articles.filter((a) => a.featured);

  // 🧩 Related articles
  const getRelatedArticles = (currentArticle, limit = 4) => {
    const currentTags = new Set(currentArticle.tags);
    const articlesWithScores = articles
      .filter((a) => a._id !== currentArticle._id)
      .map((a) => ({
        ...a,
        score: a.tags.filter((tag) => currentTags.has(tag)).length,
      }))
      .filter((a) => a.score > 0)
      .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
      .slice(0, limit);
    return articlesWithScores;
  };

  // 🔎 Search
  const searchArticles = (query) => {
    const lowerQuery = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery) ||
        a.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  };

  // 🧾 All unique tags
  const getAllTags = () => {
    const tagSet = new Set();
    articles.forEach((a) => a.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  };

  const value = {
    articles,
    loading,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticleBySlug,
    getArticleById,
    getArticlesByTag,
    getFeaturedArticles,
    getRelatedArticles,
    searchArticles,
    getAllTags,
  };

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
}
