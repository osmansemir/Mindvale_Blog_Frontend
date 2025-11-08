import { ItemActions } from "../ui/item";
import { Button } from "../ui/button";
import { useArticles } from "../../hooks/useArticles";
import ConfirmActionDialog from "./ConfirmActionDialog";
import { useNavigate } from "react-router-dom";

function ArtcileActions({ id }) {
  const { deleteArticle } = useArticles();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/articles/edit/${id}`);
  };

  return (
    <ItemActions>
      <Button onClick={() => handleClick()} size="sm" className="">
        Edit
      </Button>
      <ConfirmActionDialog
        action="Delete"
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete this article and remove it from our servers."
        onConfirm={deleteArticle(id)}
      >
        <Button size="sm" className="">
          Delete
        </Button>
      </ConfirmActionDialog>
    </ItemActions>
  );
}

export default ArtcileActions;
