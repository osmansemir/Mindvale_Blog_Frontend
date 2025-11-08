import { useContext } from "react";
import { MarkdownEditorContext } from "@/context/MarkdownEditorContext";

export function useMarkdownEditor() {
  const context = useContext(MarkdownEditorContext);

  if (context === undefined) {
    throw new Error(
      "useMarkdownEditor must be used within an MarkdownEditorProvider",
    );
  }

  return context;
}
