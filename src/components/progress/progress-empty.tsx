import React from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const StyledLink = styled(Link)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
  color: theme.palette.primary.main,
  borderRadius: "1rem",
}));

const StyledButton = styled(Button)(() => ({
  height: "90%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "1rem",
}));

const ProgressEmpty = () => (
  <StyledButton onClick={(e) => e.preventDefault()}>
    <StyledLink to={"/plan"}>Kurse hinzufügen</StyledLink>
  </StyledButton>
);

export default ProgressEmpty;
