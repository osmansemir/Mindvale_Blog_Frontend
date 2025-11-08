import { useNavigate } from "react-router-dom";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { useArticles } from "@/hooks/useArticles";
import { toast } from "sonner";

function MEForm({ children, className }) {
  const { handleSubmit, watch, inEditingMode, id, initialSlug } =
    useMarkdownEditor();
  const { addArticle, updateArticle, slugs, setSlugs } = useArticles();
  const navigate = useNavigate();

  const titleValue = watch("title");

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };
  const onSubmit = async (data) => {
    const newSlug = generateSlug(titleValue);
    const newData = { ...data, slug: newSlug };

    try {
      // Validate slug
      const slugExists = slugs.includes(initialSlug);
      if (slugExists && newSlug !== initialSlug) {
        toast.error("Slug already exists. Please choose a different title.");
        return;
      }

      // Save article
      if (inEditingMode) {
        await updateArticle(id, newData);
      } else {
        await addArticle(newData);
      }

      // Update slugs array
      if (inEditingMode && newSlug !== initialSlug) {
        setSlugs(
          slugs
            .filter((s) => (typeof s === "string" ? s : s.slug) !== initialSlug)
            .concat(newSlug),
        );
      } else if (!inEditingMode) {
        setSlugs([...slugs, newSlug]);
      }

      navigate(-1);
    } catch (error) {
      console.error("Failed to save article:", error);
      toast.error("Failed to save article. Please try again.");
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      {children}
    </form>
  );
}

export default MEForm;
