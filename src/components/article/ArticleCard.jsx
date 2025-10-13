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

function ArticleCard({ article, isAdmin }) {
  return (
    <Item className="px-0">
      <ItemHeader>
        <ItemTitle>
          <Link to={`/articles/${article.slug}`}>{article.title}</Link>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        {article.description && (
          <ItemDescription>{article.description}</ItemDescription>
        )}
      </ItemContent>
      {isAdmin && <ArticleActions id={article._id} />}
      <ItemFooter>
        <Link to={`/articles/${article.slug}`}>Read more</Link>
      </ItemFooter>
    </Item>
  );
}

export default ArticleCard;
