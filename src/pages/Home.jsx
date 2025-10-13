import ArticleList from "../components/article/ArticleList.jsx";
import { useArticles } from "../hooks/useArticles.jsx";

function Home() {
  const { articles } = useArticles();
  return (
    <>
      <main className="overflow-y-auto flex-1 md:max-w-2xl px-4 mx-auto pt-10">
        {!articles || <h1 className="text-5xl font-bold  mb-4">Articles</h1>}
        <ArticleList articles={articles} />
      </main>
    </>
  );
}
export default Home;
