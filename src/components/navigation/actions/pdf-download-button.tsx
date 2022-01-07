import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { pdf } from "@react-pdf/renderer";
import PdfDocument from "../../pdf/pdf-document";
import { useAppSelector } from "../../../redux/hooks";
import { FileText } from "lucide-react";

interface Props {
  onClose?: () => void;
}

const PdfDownloadButton = ({ onClose }: Props) => {
  const curriculum = useAppSelector((state) => state.data.curriculum);

  const handleClick = async () => {
    const anchorElement = document.createElement("a");
    const date = new Date();
    anchorElement.download =
      "studienplan-" +
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getMilliseconds()).padStart(3, "0") +
      ".pdf";
    const url = URL.createObjectURL(
      await pdf(<PdfDocument curriculum={curriculum} />).toBlob()
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
    <ListItem button onClick={handleClick}>
      <ListItemIcon>
        <FileText />
      </ListItemIcon>
      <ListItemText>Export PDF</ListItemText>
    </ListItem>
  );
};

export default PdfDownloadButton;
