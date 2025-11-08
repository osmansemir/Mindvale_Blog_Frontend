import { Textarea } from "@/components/ui/textarea";
import MarkdownDisplay from "@/components/article/MarkdownDisplay";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import MEFooter from "@/components/markdownEditor/MEFooter";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import MEForm from "@/components/markdownEditor/MEForm";
import MEHeader from "@/components/markdownEditor/MEHeader";

function MarkdownEditor() {
  const { markdownValue, register } = useMarkdownEditor();

  return (
    <MEForm className="flex flex-col h-screen">
      <MEHeader />

      <ScrollArea className="h-[calc(100vh-124px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            {/* Markdown Editor */}
            <div className="h-full">
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
            <div className="h-full p-3 overflow-y-auto pb-16">
              <MarkdownDisplay markdown={markdownValue} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ScrollArea>

      <MEFooter />
    </MEForm>
  );
}

export default MarkdownEditor;
