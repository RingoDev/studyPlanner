import { styled } from "@mui/material/styles";
import { NavLink as ReactRouterNavLink } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import React from "react";

const StyledLink = styled(ReactRouterNavLink)(({ theme }) => ({
  textDecoration: "none",
  "&.active > button": {
    backgroundColor: theme.palette.primary.light,
  },
}));

interface Props {
  to: string;
  text: string;
}

const NavLink = ({ to, text }: Props) => {
  return (
    <StyledLink to={to}>
      <Button>
        <Typography>{text}</Typography>
      </Button>
    </StyledLink>
  );
};

export default NavLink;
