import { useEffect } from "react";
import MarkdownDisplay from "../components/article/MarkdownDisplay";
import ArticleMetadata from "../components/article/ArticleMetadata";
import AuthorCard from "../components/article/AuthorCard";
import RelatedArticles from "../components/article/RelatedArticles";
import { useArticles } from "../hooks/useArticles";
import { useNavigate, useParams } from "react-router-dom";

function Post() {
  const { getArticleBySlug } = useArticles();
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  const navigate = useNavigate();

  useEffect(() => {
    if (!article) navigate("/404", { replace: true });
  });

  if (!article) return <div>Article not found!</div>;

  return (
    <main className=" pt-8 pb-6 lg:pt-16 lg:pb-24 p-5 sm:p-16 antialiased overflow-y-auto">
      <div className="mx-auto sm:max-w-2xl w-full">
        {/* Article Content */}
        <MarkdownDisplay markdown={article.markdown} />

        {/* Article Metadata */}
        <ArticleMetadata article={article} />

        {/* Author Card */}
        {article.author && <AuthorCard author={article.author} />}

        {/* Related Articles */}
        <RelatedArticles currentArticle={article} limit={4} />
      </div>
    </main>
  );
}

export default Post;
