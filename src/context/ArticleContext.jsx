import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

// eslint-disable-next-line
export const ArticleContext = createContext();

export function ArticleProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, filter, and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // 🧠 Fetch all articles from the backend with filters
  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedTags.length > 0) params.append("tags", selectedTags.join(","));
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("order", sortOrder);
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());

      const res = await api.get(`/articles?${params.toString()}`);

      // Backend returns { data: [...], pagination: {...} }
      const articlesData = res.data.data || res.data;
      setArticles(Array.isArray(articlesData) ? articlesData : []);

      // Update pagination if available
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setArticles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, selectedTags, sortBy, sortOrder, currentPage, pageSize]);

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

  // =============== WORKFLOW FUNCTIONS ===============

  // 📝 Get my articles (for authors)
  const getMyArticles = async (status = null) => {
    try {
      const url = status
        ? `/articles/my/articles?status=${status}`
        : "/articles/my/articles";
      const res = await api.get(url);
      const articlesData = res.data.data || res.data;
      return Array.isArray(articlesData) ? articlesData : [];
    } catch (error) {
      console.error("Failed to fetch my articles:", error);
      throw error;
    }
  };

  // 📤 Submit article for review
  const submitArticleForReview = async (id) => {
    try {
      const res = await api.post(`/articles/${id}/submit`);
      // Update local state
      setArticles(
        articles.map((article) =>
          article._id === id ? { ...article, status: "pending", submittedAt: new Date() } : article
        )
      );
      return res.data;
    } catch (error) {
      console.error("Failed to submit article:", error);
      throw error;
    }
  };

  // 📋 Get pending articles (for admins)
  const getPendingArticles = async () => {
    try {
      const res = await api.get("/articles/admin/pending");
      const articlesData = res.data.data || res.data;
      return Array.isArray(articlesData) ? articlesData : [];
    } catch (error) {
      console.error("Failed to fetch pending articles:", error);
      throw error;
    }
  };

  // ✅ Approve article (admin only)
  const approveArticle = async (id) => {
    try {
      const res = await api.post(`/articles/${id}/approve`);
      // Update local state
      setArticles(
        articles.map((article) =>
          article._id === id ? res.data.article || res.data : article
        )
      );
      return res.data;
    } catch (error) {
      console.error("Failed to approve article:", error);
      throw error;
    }
  };

  // ❌ Reject article (admin only)
  const rejectArticle = async (id, reason) => {
    try {
      const res = await api.post(`/articles/${id}/reject`, { reason });
      // Update local state
      setArticles(
        articles.map((article) =>
          article._id === id ? res.data.article || res.data : article
        )
      );
      return res.data;
    } catch (error) {
      console.error("Failed to reject article:", error);
      throw error;
    }
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
    // Workflow functions
    getMyArticles,
    submitArticleForReview,
    getPendingArticles,
    approveArticle,
    rejectArticle,
    // Search, filter, and pagination
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    pagination,
    fetchArticles,
  };

  return (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
  );
}
