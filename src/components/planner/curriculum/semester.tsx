import React from "react";
import { SemesterType } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Box, Button, Typography } from "@mui/material";
import { removeSemester } from "../../../redux/data/data.actions";
import SemesterName from "./semesterName";
import CourseListDroppable from "./course-list-droppable";
import { styled } from "@mui/material/styles";

const SemesterContainer = styled("div")(({ theme }) => ({
  position: "relative",
  padding: "1rem",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: theme.palette.secondary.light,
  borderRadius: "1rem",
  [theme.breakpoints.up("md")]: {
    padding: "3rem 1rem 1rem 1rem",
  },
}));

const ListContainer = styled("div")(({ theme }) => ({
  paddingLeft: "4rem",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    paddingLeft: "0",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.secondary.light,
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Semester = ({
  semester,
  index,
}: {
  semester: SemesterType;
  index: number;
}) => {
  const customECTsCounter = useAppSelector(
    (state) => state.data.curriculum.semesters[index].customEcts
  );

  const dispatch = useAppDispatch();
  return (
    <SemesterContainer>
      <SemesterName semester={semester} />
      <ListContainer>
        <CourseListDroppable semester={semester} index={index} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography align={"center"} fontSize={"1.75rem"}>
            {customECTsCounter +
              semester.courses.reduce(
                (prev, course) => prev + course.ects,
                0
              )}{" "}
            ECTS
          </Typography>
          <StyledButton
            onClick={() => dispatch(removeSemester({ semesterIndex: index }))}
          >
            Semester entfernen
          </StyledButton>
        </Box>
      </ListContainer>
    </SemesterContainer>
  );
};

export default Semester;
