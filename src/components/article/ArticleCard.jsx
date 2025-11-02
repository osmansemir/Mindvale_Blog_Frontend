import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "../ui/item";
import { Link } from "react-router-dom";
import ArticleActions from "./ArticleActions";
import ArticleExcerpt from "./ArticleExcerpt";

function ArticleCard({ article, isAdmin }) {
  return (
    <Item className="px-0">
      <ItemHeader className="flex-col items-start gap-0">
        <ItemTitle className="text-lg font-bold">
          <Link to={`/articles/${article.slug}`}>{article.title}</Link>
        </ItemTitle>
        <ItemDescription>{article.description}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ArticleExcerpt markdown={article.markdown} maxLength={300} />
      </ItemContent>
      {isAdmin && <ArticleActions id={article._id} />}
      <ItemFooter>
        <Link to={`/articles/${article.slug}`}>Read more</Link>
      </ItemFooter>
    </Item>
  );
}

export default ArticleCard;
