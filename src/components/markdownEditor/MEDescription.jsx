import { useMarkdownEditor } from "../../hooks/useMarkdownEditor";
import { Field } from "../ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "../ui/input";

function MEDescription({ className }) {
  const { register, errors } = useMarkdownEditor();

  return (
    <Field className={className}>
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
          {errors.description ? errors.description.message : "Description"}
        </TooltipContent>
      </Tooltip>
    </Field>
  );
}
export default MEDescription;
