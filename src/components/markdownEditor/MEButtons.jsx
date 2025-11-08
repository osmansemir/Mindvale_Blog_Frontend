import { useNavigate } from "react-router-dom";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import ConfirmActionDialog from "@/components/article/ConfirmActionDialog";

function MEButtons({ className }) {
  const { isSubmitting } = useMarkdownEditor();
  const navigate = useNavigate();

  return (
    <ButtonGroup className={className}>
      <ConfirmActionDialog
        onConfirm={() => navigate(-1)}
        action="Discard"
        title="Are you sure you want to discard your changes?"
        description="All changes will be lost if you leave this page."
      >
        <Button variant="destructive">Discard</Button>
      </ConfirmActionDialog>
      <Button type="submit">{isSubmitting ? "Saving..." : "Save"}</Button>
    </ButtonGroup>
  );
}
export default MEButtons;
