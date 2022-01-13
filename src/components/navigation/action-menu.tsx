import { MoreVertical } from "lucide-react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useRef, useState } from "react";
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

interface ButtonProps {
  onClose?: () => void;
}

interface Props {
  actions: ((props: ButtonProps) => JSX.Element)[];
}

const ActionMenu = ({ actions }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

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
        {actions.map((Action, index) => (
          <ActionItem key={index}>
            <Action onClose={handleClose} />
          </ActionItem>
        ))}
      </Menu>
    </>
  );
};
export default ActionMenu;
