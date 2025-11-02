import { ItemActions } from "../ui/item";
import { Button } from "../ui/button";
import { useArticles } from "../../hooks/useArticles";
import AlertAction from "./AlertAction";
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
      <AlertAction id={id} action={deleteArticle}>
        <Button size="sm" className="">
          Delete
        </Button>
      </AlertAction>
    </ItemActions>
  );
}

export default ArtcileActions;
