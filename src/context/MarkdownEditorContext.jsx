import { createContext, useState, useEffect } from "react";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useArticles } from "../hooks/useArticles";

//eslint-disable-next-line
export const MarkdownEditorContext = createContext();

// Define validation schema (slug, author, and featured are auto-generated)
const articleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  markdown: z.string().min(20, "Markdown must be at least 20 characters"),
});

export function MarkdownEditorProvider({ children }) {
  const { id } = useParams();
  const { getArticleById } = useArticles();
  const [inEditingMode, setInEditingMode] = useState(false);
  const [initialSlug, setInitialSlug] = useState("");

  // Load article if editing
  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const article = await getArticleById(id);
        if (article) reset(article);
        setInEditingMode(true);
        setInitialSlug(article.slug);
      } catch (err) {
        console.error("Error loading article:", err);
      }
    };
    fetchArticle();
  }, [id]); // eslint-disable-line

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      markdown: "",
      slug: "",
    },
  });

  const markdownValue = watch("markdown");
  const value = {
    register,
    handleSubmit,
    reset,
    watch,
    id,
    errors,
    isSubmitting,
    markdownValue,
    control,
    initialSlug,
    inEditingMode,
  };

  return (
    <MarkdownEditorContext.Provider value={value}>
      {children}
    </MarkdownEditorContext.Provider>
  );
}
