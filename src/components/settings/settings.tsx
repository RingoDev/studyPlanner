import React from "react";
import { styled } from "@mui/material/styles";
import SelectStartSemester from "./select-start-semester";
import SelectExamplePlan from "./select-example-plan";
import SelectStudies from "./select-studies";

const SettingsContainer = styled("div")(({ theme }) => ({
  backgroundColor: "#dddddd",
  padding: "2rem",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  "> div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  "> div > *": {
    padding: "0.25rem",
  },

  [theme.breakpoints.up("md")]: {
    "> div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: 0,
    },
    borderRadius: "2rem",
    "> div > *": {
      padding: "0.5rem",
    },
  },
}));

const OuterContainer = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: "#dddddd",
  // padding: "2rem",
  [theme.breakpoints.up("md")]: {
    padding: "2rem",
    backgroundColor: theme.palette.secondary.dark,
  },
  [theme.breakpoints.down("sm")]: {},
}));

const MainContainer = styled("div")(({ theme }) => ({
  height: "100%",
  maxWidth: "1636px",
  margin: "auto",
  [theme.breakpoints.up("md")]: {
    // padding: "2rem",
  },
}));

const Settings = () => {
  return (
    <MainContainer>
      <OuterContainer>
        <SettingsContainer>
          <SelectStudies />
          <SelectStartSemester />
          <SelectExamplePlan />
        </SettingsContainer>
      </OuterContainer>
    </MainContainer>
  );
};

export default Settings;
