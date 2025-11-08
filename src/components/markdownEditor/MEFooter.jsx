import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";

function MEFooter() {
  const { markdownValue } = useMarkdownEditor();

  const wordCount = (markdown) => {
    if (!markdown) return 0;
    return markdown
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };
  return (
    <footer className="h-6 bg-foreground text-background text-sm flex items-center px-3">
      Words: {wordCount(markdownValue)}
    </footer>
  );
}
export default MEFooter;
