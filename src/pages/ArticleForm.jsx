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

// Define validation schema
const articleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only and should not start or end with a hyphen",
    ),
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
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(50, "Author name must be less than 50 characters"),
  markdown: z.string().optional(),
});

function ArticleForm({ article: initialArticle, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialArticle?.title || "",
      slug: initialArticle?.slug || "",
      description: initialArticle?.description || "",
      tags: initialArticle?.tags || "",
      author: initialArticle?.author || "",
      markdown: initialArticle?.markdown || "",
    },
  });

  useEffect(() => {
    if (initialArticle) {
      reset(initialArticle);
    }
  }, [initialArticle, reset]);

  const [open, setOpen] = useState(false);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Watch title field to auto-generate slug
  const titleValue = watch("title");

  useEffect(() => {
    if (titleValue) {
      const slug = generateSlug(titleValue);
      setValue("slug", slug);
    }
  }, [titleValue, setValue]);

  const waiting = new Promise((resolve) => setTimeout(resolve, 4000));

  const onSubmit = async (data) => {
    await waiting;
    onSave(data);
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
            Fill in all the details and hit Save. The slug will auto-generate
            from the title.
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

              {/* Slug Field */}
              <Field>
                <FieldLabel htmlFor="slug">Slug *</FieldLabel>
                <Input
                  id="slug"
                  placeholder="auto-generated-slug"
                  {...register("slug")}
                  aria-invalid={errors.slug ? "true" : "false"}
                />
                {!errors.slug && (
                  <FieldDescription>
                    Auto-generated from title. Use lowercase and hyphens.
                  </FieldDescription>
                )}
                {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
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

              {/* Author Field */}
              <Field>
                <FieldLabel htmlFor="author">Author *</FieldLabel>
                <Input
                  id="author"
                  placeholder="Your name"
                  {...register("author")}
                  aria-invalid={errors.author ? "true" : "false"}
                />
                {!errors.author && (
                  <FieldDescription>2-50 characters</FieldDescription>
                )}
                {errors.author && (
                  <FieldError>{errors.author.message}</FieldError>
                )}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ArticleForm;
