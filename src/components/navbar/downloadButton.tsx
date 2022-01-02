import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { createSaveObject } from "../../lib/storeAndLoad";
import { Button, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Download } from "lucide-react";

interface Props {
  isMobile?: boolean;
}

const DownloadButton: React.FC<Props> = ({ isMobile, children }) => {
  const curriculum = useAppSelector((state) => state.data.curriculum);

  const clickDownloadLink = () => {
    const anchorElement = document.createElement("a");
    anchorElement.download = "curriculum.jku";
    anchorElement.href = URL.createObjectURL(
      new Blob([createSaveObject(curriculum, "0.0.2")])
    );
    anchorElement.click();
    anchorElement.remove();
  };

  if (isMobile)
    return (
      <ListItem button onClick={clickDownloadLink}>
        <ListItemIcon>
          <Download />
        </ListItemIcon>
        <ListItemText>Export</ListItemText>
      </ListItem>
    );

  return <Button onClick={clickDownloadLink}>{children}</Button>;
};
export default DownloadButton;
