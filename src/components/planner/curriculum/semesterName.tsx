import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { SemesterType } from "../../../types/types";

const VerticalBox = styled(Typography)(({ theme }) => ({
  zIndex: 2,
  fontSize: "2.25rem",
  position: "absolute",
  top: "11.5rem",
  minWidth: "20rem",
  left: "-6.5rem",
  transform: "rotate(270deg)",
  textAlign: "right",
  [theme.breakpoints.down("md")]: {
    position: "relative",
    transform: "none",
    top: "0",
    left: "0",
    textAlign: "center",
  },
}));

interface Props {
  semester: SemesterType;
}

const SemesterName = ({ semester }: Props) => {
  return <VerticalBox color={"primary"}>{semester.name}</VerticalBox>;
};

export default SemesterName;
