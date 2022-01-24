import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useAppDispatch } from "../../../lib/hooks/redux-hooks";
import { resetCurriculum } from "../../../redux/data/data.actions";
import { Trash } from "lucide-react";

interface Props {
  onClose?: () => void;
}

const DeleteButton = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();

  const confirmDelete = () => {
    if (window.confirm("Möchtest du deinen Studienplan wirklich löschen?")) {
      dispatch(resetCurriculum({}));
      if (onClose) onClose();
    } else {
      if (onClose) onClose();
    }
  };
  return (
    <ListItem button onClick={confirmDelete}>
      <ListItemIcon>
        <Trash />
      </ListItemIcon>
      <ListItemText>Löschen</ListItemText>
    </ListItem>
  );
};

export default DeleteButton;
