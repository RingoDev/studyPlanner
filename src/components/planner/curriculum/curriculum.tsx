import React from "react";
import Semester from "./semester";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addSemester } from "../../../redux/data/data.actions";
import { styled } from "@mui/material/styles";
import { Droppable } from "react-beautiful-dnd";

const CurriculumContainer = styled("div")(({ theme }) => ({
  margin: "0",
  marginLeft: "auto",
  marginRight: "1rem",
  width: "90%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "flex-start",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));

const SemesterWrapper = styled("div")(({ theme }) => ({
  maxWidth: "35rem",
  flexBasis: "50%",
  minHeight: "20rem",
  minWidth: "35rem",
  padding: "0 1rem 2rem 1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexGrow: 1,
  flexShrink:0,
  "> *": {
    flexGrow: 1,
  },
  [theme.breakpoints.up("md")]: {
    minWidth: "26rem",
  },
}));

const StyledButton = styled(Button)(() => ({
  flexBasis: "50%",
  height: "100%",
  borderRadius: "1rem",
  minHeight:"18,75rem"
}));

const Curriculum = () => {
  const curriculum = useAppSelector((state) => state.data.curriculum);
  const dispatch = useAppDispatch();

  return (
    <CurriculumContainer>
      {curriculum.semesters.map((s, index) => (
        <SemesterWrapper key={index}>
          <Semester semester={s} index={index} />
        </SemesterWrapper>
      ))}
      <SemesterWrapper>
        <Droppable droppableId={"sem" + curriculum.semesters.length}>
          {(provided) => (
            <StyledButton
              ref={provided.innerRef}
              {...provided.droppableProps}
              onClick={() => dispatch(addSemester({}))}
            >
              Semester hinzufügen
            </StyledButton>
          )}
        </Droppable>
      </SemesterWrapper>
    </CurriculumContainer>
  );
};

export default Curriculum;
