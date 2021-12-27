import React, { useState } from "react";
import Curriculum from "./Curriculum";
import Storage from "./storage";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { moveCourse, moveGroup } from "../../redux/data/data.actions";
import { useAppDispatch } from "../../redux/hooks";
import { styled } from "@mui/material/styles";

const MainContainer = styled("div")(({ theme }) => ({
  padding: "0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  height: "90vh",
  maxWidth: "1636px",
  margin: "auto",
  [theme.breakpoints.up("md")]: {
    padding: "5vh 2rem",
  },
}));

const StorageWrapper = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "block",
    flex: "0 1 20%",
    borderRadius: "1em",
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
    backgroundColor: "#dddddd",
  },
}));

const CurriculumWrapper = styled("div")(() => ({
  flex: "1 1 75%",
  overflowY: "auto",
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
}));

const Planner = () => {
  const dispatch = useAppDispatch();
  const [showPseudoDroppable, setShowPseudoDroppable] =
    useState<boolean>(false);

  const handleDragStart = () => {
    setShowPseudoDroppable(true);
  };

  const handleDragEnd = ({ destination, draggableId, source }: DropResult) => {
    if (showPseudoDroppable) setShowPseudoDroppable(false);
    if (destination === undefined || destination === null) return;
    if (draggableId.startsWith("c_")) {
      dispatch(
        moveCourse({
          courseId: draggableId.slice(2),
          sourceId: source.droppableId,
          destinationId: destination.droppableId,
          destinationIndex: destination.index,
        })
      );
    } else if (draggableId.startsWith("g_")) {
      dispatch(
        moveGroup({
          destinationId: destination.droppableId,
          groupId: draggableId.slice(2),
          destinationIndex: destination.index,
        })
      );
    } else {
      console.error("wrong draggable id format: ", draggableId);
    }
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onBeforeDragStart={handleDragStart}
    >
      <MainContainer>
        <StorageWrapper>
          <Storage showPseudoDroppable={showPseudoDroppable} />
        </StorageWrapper>
        <CurriculumWrapper>
          <Curriculum />
        </CurriculumWrapper>
      </MainContainer>
    </DragDropContext>
  );
};

export default Planner;
