import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import NavbarMobile from "./navbar-mobile";
import Search from "./search";
import ActionMenu from "./action-menu";
import NavLink from "./nav-link";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    maxWidth: "1736px",
    width: "100%",
    margin: "auto",
  },
  "*": {
    color: "black",
  },
}));

const ActionContainer = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    alignItems: "center",
  },
}));

const StyledSearchContainer = styled(ActionContainer)(() => ({
  minWidth: "30rem",
  padding: "0 1rem",
}));

const StyledAppbar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
}));

const Navbar = () => {
  return (
    <StyledAppbar position={"static"}>
      <StyledToolbar>
        <ActionContainer>
          <NavLink to={"/plan"} text={"Planung"} />
          <NavLink to={"/progress"} text={"Übersicht"} />
          <NavLink to={"/settings"} text={"Optionen"} />
        </ActionContainer>

        <ActionContainer>
          <StyledSearchContainer>
            <Search />
          </StyledSearchContainer>
          <ActionMenu />
        </ActionContainer>

        <NavbarMobile />
      </StyledToolbar>
    </StyledAppbar>
  );
};

export default Navbar;
