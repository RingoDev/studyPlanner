import React from "react";
import Semester from "./semester";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addSemester } from "../../../redux/data/data.actions";
import { styled } from "@mui/material/styles";
import { Droppable } from "react-beautiful-dnd";

const CurriculumContainer = styled("div")(() => ({
  margin: "0",
  marginLeft: "auto",
  marginRight: "1rem",
  width: "90%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
}));

const SemesterWrapper = styled("div")(() => ({
  maxWidth: "50%",
  flexBasis: "50%",
  minHeight: "20rem",
  padding: "0 1rem 2rem 1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexGrow: 1,
  "> *": {
    flexGrow: 1,
  },
}));

const StyledButton = styled(Button)(() => ({
  flexBasis: "50%",
  height: "100%",
  borderRadius: "1rem",
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
