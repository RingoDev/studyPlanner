import React from "react";
import { styled } from "@mui/material/styles";
import CourseList from "./courseList";
import SemesterStatistics from "./semesterStatistics";

const SemesterContainer = styled("div")(({ theme }) => ({
  position: "relative",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  background: theme.palette.secondary.light,
  borderRadius: "1rem",
}));

const ListContainer = styled("div")(({ theme }) => ({
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    paddingLeft: "0",
  },
}));

const CurriculumWrapper = styled("div")(({ theme }) => ({
  padding: "0 2rem",
  height: "100%",
  flex: "1 1 100%",

  [theme.breakpoints.up("md")]: {
    overflowY: "auto",
    flex: "1 1 50%",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      backgroundColor: "#555555",
      outline: "1px solid #444444",
      borderRadius: "1em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#777777",
      borderRadius: "1em",
    },
  },
}));

const ProgressWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  padding: "1rem 0.5rem",

  flex: "1 1 100%",

  [theme.breakpoints.up("md")]: {
    flexDirection: "row-reverse",
    overflow: "auto",
    padding: "2rem",
  },
}));

interface Props {
  index?: number;
}

const ProgressSemester = ({ index }: Props) => {
  return (
    <ProgressWrapper>
      <CurriculumWrapper>
        <SemesterStatistics semesterIndex={index} />
      </CurriculumWrapper>
      <CurriculumWrapper>
        <SemesterContainer>
          <ListContainer>
            <CourseList semesterIndex={index} />
          </ListContainer>
        </SemesterContainer>
      </CurriculumWrapper>
    </ProgressWrapper>
  );
};

export default ProgressSemester;
