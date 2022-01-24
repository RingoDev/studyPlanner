import React from "react";
import { useAppSelector } from "../../../lib/hooks/redux-hooks";
import { createSaveObject } from "../../../lib/storeAndLoad";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Download } from "lucide-react";

interface Props {
  onClose?: () => void;
}

const DownloadButton = ({ onClose }: Props) => {
  const curriculum = useAppSelector((state) => state.data.curriculum);
  const startSemester = useAppSelector((state) => state.data.startSemester);

  const clickDownloadLink = () => {
    const anchorElement = document.createElement("a");
    anchorElement.download = "curriculum.jku";
    const url = URL.createObjectURL(
      new Blob([createSaveObject(curriculum, startSemester)])
    );
    anchorElement.href = url;
    anchorElement.click();
    anchorElement.remove();
    URL.revokeObjectURL(url);

    if (onClose) {
      onClose();
    }
  };

  return (
    <ListItem button onClick={clickDownloadLink}>
      <ListItemIcon>
        <Download />
      </ListItemIcon>
      <ListItemText>Speichern</ListItemText>
    </ListItem>
  );
};
export default DownloadButton;
