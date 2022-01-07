import { MoreVertical } from "lucide-react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useRef, useState } from "react";
import DeleteButton from "./actions/delete-button";
import DownloadButton from "./actions/download-button";
import UploadButton from "./actions/upload-button";
import PdfDownloadButton from "./actions/pdf-download-button";
import { styled } from "@mui/material/styles";

const ActionItem = styled(MenuItem)(() => ({
  padding: 0,
  "& > *": {
    textTransform: "uppercase",
    fontWeight: "bold !important",
    display: "flex",
    padding: "0.5rem 1rem",
  },
  "& > * *": {
    color: "#000000",
  },
}));

const ActionMenu = () => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const actions = [
    <DeleteButton onClose={handleClose} />,
    <DownloadButton onClose={handleClose} />,
    <UploadButton onClose={handleClose} />,
    <PdfDownloadButton onClose={handleClose} />,
  ];

  return (
    <>
      <IconButton
        ref={ref}
        style={{ position: "relative" }}
        onClick={handleClick}
        sx={{ flexGrow: "0", display: "inline-flex" }}
      >
        <MoreVertical />
      </IconButton>
      <Menu anchorEl={ref.current} open={open} onClose={handleClose}>
        {actions.map((action, index) => (
          <ActionItem key={index}>{action}</ActionItem>
        ))}
      </Menu>
    </>
  );
};
export default ActionMenu;
