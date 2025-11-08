import { useMarkdownEditor } from "../../hooks/useMarkdownEditor";
import { Field } from "../ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Controller } from "react-hook-form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { useArticles } from "../../hooks/useArticles";
import { useMemo } from "react";

function METags({ className }) {
  const { allTags } = useArticles();
  const { control, errors } = useMarkdownEditor();

  const tagOptions = useMemo(() => {
    return allTags.map((tag) => ({
      value: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1), // Capitalize first letter
    }));
  }, [allTags]);

  return (
    <Field className={className}>
      <Controller
        control={control}
        name="tags"
        render={({ field }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <MultiSelector
                values={
                  field.value?.map((val) => {
                    const option = tagOptions.find((opt) => opt.value === val);
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
  );
}
export default METags;
