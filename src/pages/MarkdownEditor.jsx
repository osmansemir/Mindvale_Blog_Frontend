import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import MarkdownDisplay from "../components/article/MarkdownDisplay";
import { useState, useEffect } from "react";
import ArticleForm from "./ArticleForm";
import { useArticles } from "../hooks/useArticles";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Input } from "../components/ui/input";
import { ModeToggle } from "../components/ModeToggle";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Item, ItemTitle } from "../components/ui/item";

function MarkdownEditor() {
  const [article, setArticle] = useState({
    title: "",
    slug: "",
    markdown: "",
    author: "",
    tags: "",
    description: "",
  });

  const { getArticleById, addArticle, updateArticle } = useArticles();
  const navigate = useNavigate();
  const { id } = useParams();

  // Load article if editing
  useEffect(() => {
    if (id) {
      const existingArticle = getArticleById(id);
      if (existingArticle) {
        setArticle(existingArticle);
      } else {
        navigate("/404", { replace: true });
      }
    }
  }, [id]); //eslint-disable-line

  // Handle markdown changes in real-time
  const handleMarkdownChange = (markdown) => {
    setArticle((prev) => ({
      ...prev,
      markdown,
    }));
  };

  // if no article id, we are creating a new article
  const inEditingMode = !!article?._id;

  const onSave = (newData) => {
    if (inEditingMode) {
      updateArticle(article._id, newData);
      console.log("Edits saved:", newData);
    } else {
      addArticle(newData);
      console.log("Article saved:", newData);
    }
    navigate(-1);
  };

  const wordCount = article.markdown
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex font-bold items-center border-b px-6 h-[100px]">
        <div className="w-1/2 flex-col">
          <h1 className="text-2xl mb-2">{article.title || "Untitled"}</h1>

          <ArticleForm article={article} onSave={onSave} />
          <Button variant="outline" onClick={() => navigate(-1)}>
            Discard
          </Button>
        </div>

        <div className="mx-3 grow"></div>
        <ModeToggle />
      </div>

      {/* Editor and Preview */}
      <ScrollArea className="h-[calc(100vh-124px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            {/* Markdown Editor */}
            <div className="h-full">
              <Item className="h-12 text-primary-foreground bg-sidebar-accent rounded-none">
                <ItemTitle>Markdown</ItemTitle>
              </Item>
              <Textarea
                className="h-full w-full pb-16 font-mono rounded-none resize-none focus-visible:ring-0 border-0 focus-visible:border-0"
                placeholder="Type your markdown here..."
                value={article.markdown}
                onChange={(e) => handleMarkdownChange(e.target.value)}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            {/* Preview */}
            <Item className="h-12 text-primary-foreground bg-sidebar-accent rounded-none">
              <ItemTitle>Preview</ItemTitle>
            </Item>
            <div className="h-full p-3 overflow-y-auto pb-16">
              <MarkdownDisplay markdown={article.markdown} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ScrollArea>

      {/* Footer - Word Count */}
      <div className="h-6 bg-foreground text-background text-sm flex items-center px-3">
        Words: {wordCount}
      </div>
    </div>
  );
}

export default MarkdownEditor;
