import { useMarkdownEditor } from "../../hooks/useMarkdownEditor";
import { Field, FieldContent, FieldError } from "../ui/field";
import { Input } from "../ui/input";

function MEDescription({ className }) {
  const { register, errors } = useMarkdownEditor();

  return (
    <Field className={className}>
      <FieldContent>
        <Input
          className="w-full bg-background text-foreground placeholder:text-muted-foreground px-3 py-2 h-9"
          id="description"
          placeholder="Description"
          {...register("description")}
          aria-invalid={errors.description ? "true" : "false"}
        />
      </FieldContent>
      {errors.description && (
        <FieldError>{errors.description.message}</FieldError>
      )}
    </Field>
  );
}
export default MEDescription;
