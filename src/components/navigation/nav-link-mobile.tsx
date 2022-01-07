import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  "&.active > *": {
    backgroundColor: theme.palette.secondary.light,
  },
  "*": {
    color: "#000000",
    textTransform: "uppercase",
  },
  "& svg": {
    color: theme.palette.primary.main,
    stroke: theme.palette.primary.main,
  },
}));

interface Props {
  to: string;
  text: string;
  icon: React.ReactElement;
}

const NavLinkMobile = ({ to, text, icon }: Props) => {
  return (
    <StyledNavLink to={to}>
      <ListItem button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </ListItem>
    </StyledNavLink>
  );
};

export default NavLinkMobile;
