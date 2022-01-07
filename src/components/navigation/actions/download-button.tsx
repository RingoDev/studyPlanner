import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { createSaveObject } from "../../../lib/storeAndLoad";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Download } from "lucide-react";

interface Props {
  onClose?: () => void;
}

const DownloadButton = ({ onClose }: Props) => {
  const curriculum = useAppSelector((state) => state.data.curriculum);

  const clickDownloadLink = () => {
    const anchorElement = document.createElement("a");
    anchorElement.download = "curriculum.jku";
    const url = URL.createObjectURL(
      new Blob([createSaveObject(curriculum, "0.0.2")])
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
