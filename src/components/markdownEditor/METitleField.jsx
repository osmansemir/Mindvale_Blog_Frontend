import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function METitleField({ className }) {
  const { register, errors } = useMarkdownEditor();

  return (
    <Field className={className}>
      <FieldContent>
        <Input
          className="h-9"
          id="title"
          placeholder="Title"
          {...register("title")}
          aria-invalid={errors.title ? "true" : "false"}
        />
      </FieldContent>
      {errors.title && <FieldError>{errors.title.message}</FieldError>}
    </Field>
  );
}
export default METitleField;
