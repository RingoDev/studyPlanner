import React, { useState } from "react";
import Curriculum from "./curriculum/curriculum";
import Storage from "./storage/storage";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { moveCourse, moveGroup } from "../../redux/data/data.actions";
import { useAppDispatch } from "../../redux/hooks";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const MainContainer = styled("div")(({ theme }) => ({
  padding: "0",
  paddingTop: "2rem",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  height: "100%",
  maxWidth: "1636px",
  margin: "auto",
  [theme.breakpoints.up("md")]: {
    padding: "2rem",
  },
}));

const StorageWrapper = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "block",
    flex: "1 1 20%",
    padding: "0 1r",
  },
}));

const CurriculumWrapper = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "block",
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
  },
}));

const MobilePlannerWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width:"100%",
  padding:"2rem",
  "> *": {
    maxWidth: "30ch",
  },
  [theme.breakpoints.up("md")]: {
    display: "none",
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
        <MobilePlannerWrapper>
          <Typography fontSize={"2rem"} color={"primary"}>
            Die Planung des Studiums ist derzeit leider nur im Desktopformat möglich.
          </Typography>
        </MobilePlannerWrapper>
      </MainContainer>
    </DragDropContext>
  );
};

export default Planner;
