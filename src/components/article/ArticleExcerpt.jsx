function ArticleExcerpt({ markdown, maxLength = 150 }) {
  // Remove markdown title (lines starting with #)
  const withoutTitle = markdown.replace(/^#+\s+.+$/gm, "").trim();

  // Get first paragraph (text before double newline or end of string)
  const firstParagraph = withoutTitle.split(/\n\n/)[0].trim();

  // Remove markdown formatting (links, bold, italic, etc.)
  const plainText = firstParagraph
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // links
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // bold/italic
    .replace(/`([^`]+)`/g, "$1") // inline code
    .trim();

  // Create excerpt
  const excerpt =
    plainText.length > maxLength
      ? plainText.slice(0, maxLength) + "..."
      : plainText;

  return <p>{excerpt}</p>;
}
export default ArticleExcerpt;
