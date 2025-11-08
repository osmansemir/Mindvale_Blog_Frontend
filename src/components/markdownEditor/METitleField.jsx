import { useMarkdownEditor } from "../../hooks/useMarkdownEditor";
import { Field } from "../ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "../ui/input";

function METitleField({ className }) {
  const { register, errors } = useMarkdownEditor();

  return (
    <Field className={className}>
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
  );
}
export default METitleField;
