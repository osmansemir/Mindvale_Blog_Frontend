import { Empty, EmptyDescription, EmptyTitle } from "../ui/empty";
import { ItemGroup, ItemSeparator } from "../ui/item";
import ArticleCard from "./ArticleCard";
import NewArticleButton from "./NewArticleButton";
import React from "react";

function ArticleList({ articles, isAdmin = false }) {
  return (
    <>
      {articles.length === 0 && (
        <Empty>
          <EmptyTitle>No Articles yet</EmptyTitle>
          <EmptyDescription>
            You can start creating articles to display them here.
          </EmptyDescription>
        </Empty>
      )}
      <ItemGroup>
        {isAdmin && <NewArticleButton />}
        {articles.map((article, index) => (
          <React.Fragment key={article._id}>
            <ArticleCard article={article} isAdmin={isAdmin} />
            {index !== articles.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>
    </>
  );
}

export default ArticleList;
