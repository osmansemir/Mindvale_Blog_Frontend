import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ButtonGroup } from "../components/ui/button-group";
import { Textarea } from "../components/ui/textarea";
import MarkdownDisplay from "../components/article/MarkdownDisplay";
import { useState, useEffect } from "react";
import { useArticles } from "../hooks/useArticles";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Input } from "../components/ui/input";
import { ModeToggle } from "../components/ModeToggle";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Item, ItemTitle } from "../components/ui/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Earth } from "lucide-react";
import { useMemo } from "react";

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

function MarkdownEditor() {
  const {
    getArticleById,
    addArticle,
    updateArticle,
    slugs,
    setSlugs,
    allTags,
  } = useArticles();
  const { id } = useParams();
  const [inEditingMode, setInEditingMode] = useState(false);
  const [initialSlug, setInitialSlug] = useState("");

  const tagOptions = useMemo(() => {
    return allTags.map((tag) => ({
      value: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1), // Capitalize first letter
    }));
  }, [allTags]);

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
  }, [id]); //eslint-disable-line

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

  const navigate = useNavigate();

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const titleValue = watch("title");
  const markdownValue = watch("markdown");

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

      // Uncomment when ready: navigate(-1);
    } catch (error) {
      console.error("Failed to save article:", error);
      toast.error("Failed to save article. Please try again.");
    }
  };

  const wordCount = (markdown) => {
    if (!markdown) return 0;
    return markdown
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex w-full gap-4  justify-between font-bold items-center border-b px-6 h-14">
        <Link to="/">
          <Earth />
        </Link>
        {/* Title Field */}
        <Field className=" grow">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                className="w-1/3 bg-background dark:bg-background text-foreground placeholder:text-muted-foreground placeholder:font-bold placeholder:text-lg border-0 outline-none shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 focus-visible:bg-background dark:focus-visible:bg-background focus-visible:shadow-none px-3 py-2 transition-none"
                id="title"
                placeholder="Title"
                {...register("title")}
                aria-invalid={errors.title ? "true" : "false"}
              />
            </TooltipTrigger>
            <TooltipContent>
              {errors.title ? errors.title.message : "Title"}
            </TooltipContent>
          </Tooltip>
        </Field>
        <ModeToggle className="self-end" />
      </div>
      <div className="flex  w-screen  justify-between font-bold items-center border-b px-6 min-h-16 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full gap-3 flex px-3 flex-col md:flex-row"
        >
          {/* Description Field */}
          <Field>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  className="w-full bg-background text-foreground placeholder:text-muted-foreground px-3 py-2 h-9/10"
                  id="description"
                  placeholder="Description"
                  {...register("description")}
                  aria-invalid={errors.description ? "true" : "false"}
                />
              </TooltipTrigger>
              <TooltipContent>
                {errors.description
                  ? errors.description.message
                  : "Description"}
              </TooltipContent>
            </Tooltip>
          </Field>

          {/* Tags Field */}
          <Field className="grow-3">
            {/* <Tooltip> */}
            {/*   <TooltipTrigger asChild> */}
            {/*     <Input */}
            {/*       className="w-full bg-background text-foreground placeholder:text-muted-foreground border-0 outline-none shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 focus-visible:bg-background focus-visible:shadow-none px-3 py-2 transition-none" */}
            {/*       id="tags" */}
            {/*       placeholder="# Tags" */}
            {/*       {...register("tags")} */}
            {/*       aria-invalid={errors.tags ? "true" : "false"} */}
            {/*     /> */}
            {/*   </TooltipTrigger> */}
            {/*   <TooltipContent> */}
            {/*     {errors.tags ? errors.tags.message : "#Tags"} */}
            {/*   </TooltipContent> */}
            {/* </Tooltip> */}
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MultiSelector
                      values={
                        field.value?.map((val) => {
                          const option = tagOptions.find(
                            (opt) => opt.value === val,
                          );
                          return option || { value: val, label: val };
                        }) || []
                      }
                      onValuesChange={(selected) => {
                        field.onChange(selected.map((item) => item.value));
                      }}
                      loop
                      className="max-w-md "
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="#Tags" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {tagOptions.map((tag) => (
                            <MultiSelectorItem
                              key={tag.value}
                              value={tag.value}
                              label={tag.value}
                            >
                              {tag.value}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </TooltipTrigger>
                  <TooltipContent>
                    {errors.tags ? errors.tags.message : "Tags"}
                  </TooltipContent>
                </Tooltip>
              )}
            />
          </Field>

          <ButtonGroup className="max-md:w-50 max-md:">
            <Button
              variant="destructive"
              //TODO: Discard dialog
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              Discard
            </Button>
            <Button type="submit">{isSubmitting ? "Saving..." : "Save"}</Button>
          </ButtonGroup>
        </form>
      </div>

      {/* Editor and Preview */}
      <ScrollArea className="h-[calc(100vh-124px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            {/* Markdown Editor */}
            <div className="h-full">
              <Item className="shadow-sm px-4 py-2 items-center text-secondary-foreground bg-secondary rounded-none">
                <ItemTitle>Markdown</ItemTitle>
              </Item>
              <Textarea
                {...register("markdown")}
                className="h-full w-full pb-16 font-mono rounded-none resize-none focus-visible:ring-0 border-0 focus-visible:border-0"
                placeholder="Type your markdown here..."
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            {/* Preview */}
            <Item className="shadow-sm px-4 py-2 items-center text-secondary-foreground bg-secondary rounded-none">
              <ItemTitle>Preview</ItemTitle>
            </Item>
            <div className="h-full p-3 overflow-y-auto pb-16">
              <MarkdownDisplay markdown={markdownValue} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ScrollArea>

      {/* Footer - Word Count */}
      <div className="h-6 bg-foreground text-background text-sm flex items-center px-3">
        Words: {wordCount(markdownValue)}
      </div>
    </div>
  );
}

export default MarkdownEditor;
