import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

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
  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (Array.isArray(val)) return val.map((t) => t.trim()).filter(Boolean);
      return val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    })
    .refine((arr) => arr.length > 0, {
      message: "At least one tag is required",
    }),
  markdown: z.string().min(20, "Markdown must be at least 20 characters"),
});

function ArticleForm({ article: article, onSave }) {
  const { user } = useAuth(); // Get authenticated user

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      description: article?.description || "",
      tags: article?.tags || "",
      markdown: article?.markdown || "",
    },
  });

  useEffect(() => {
    if (article) {
      reset(article);
    }
  }, [article, reset]);

  const [open, setOpen] = useState(false);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const onSubmit = async (data) => {
    // Auto-generate slug from title
    const slug = generateSlug(data.title);

    // Auto-populate author from authenticated user
    const articleData = {
      ...data,
      slug,
      author: user?.name || "Unknown",
      // Status will be set to "draft" by backend by default
    };

    onSave(articleData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Save Article</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Save Article</DialogTitle>
          <DialogDescription>
            Fill in the article details. The slug and author will be
            automatically set.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldSet className="grid grid-cols-2">
            {/* Title Field */}
            <FieldGroup className="col-span-1 ">
              <Field>
                <FieldLabel htmlFor="title">Title *</FieldLabel>
                <Input
                  id="title"
                  placeholder="Enter article title"
                  {...register("title")}
                  aria-invalid={errors.title ? "true" : "false"}
                />
                {!errors.title && (
                  <FieldDescription>Max 100 characters</FieldDescription>
                )}
                {errors.title && (
                  <FieldError>{errors.title.message}</FieldError>
                )}
              </Field>

              {/* Description Field */}
              <Field>
                <FieldLabel htmlFor="description">Description *</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Brief description of your article"
                  {...register("description")}
                  aria-invalid={errors.description ? "true" : "false"}
                  rows={3}
                />
                {!errors.description && (
                  <FieldDescription>10-500 characters</FieldDescription>
                )}
                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
                )}
              </Field>
            </FieldGroup>

            {/* Second row */}
            <FieldGroup className=" col-span-1">
              {/* Tags Field */}
              <Field>
                <FieldLabel htmlFor="tags">Tags *</FieldLabel>
                <Input
                  id="tags"
                  placeholder="e.g., react, javascript, web"
                  {...register("tags")}
                  aria-invalid={errors.tags ? "true" : "false"}
                />
                {!errors.tags && (
                  <FieldDescription>Comma-separated</FieldDescription>
                )}
                {errors.tags && <FieldError>{errors.tags.message}</FieldError>}
              </Field>

              {/* Author info display (read-only) */}
              <Field>
                <FieldLabel>Author</FieldLabel>
                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                  {user?.name || "Loading..."}
                </div>
                <FieldDescription>
                  Automatically set from your account
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Article"}
            </Button>
          </DialogFooter>
          {errors.markdown && (
            <FieldError>{errors.markdown.message}</FieldError>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ArticleForm;
