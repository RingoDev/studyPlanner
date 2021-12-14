import React from "react";
import { useAppSelector } from "../../redux/hooks";
import DroppableGroupList from "./droppableGroupList";
import { Droppable } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";
import { PSEUDO_STORAGE, STORAGE } from "../../types/dndTypes";

interface Props {
  showPseudoDroppable: boolean;
}

const StorageContainer = styled("div")(() => ({
  height: "100%",
  borderRadius: "1em",
  position: "relative",
}));

const PseudoStorage = styled("div")(() => ({
  border: "outline 4px dashed #cccccc",
  position: "absolute",
  top: "-1.5rem",
  left: "-1rem",
  height: "calc(100% + 3rem)",
  width: "calc(100% + 1.5rem)",
  backgroundColor: "#ffffff88",
  transition: "color 5s",
  backdropFilter: "blur(5px)",
  borderRadius: "1em",
}));

const Storage = ({ showPseudoDroppable }: Props) => {
  const storage = useAppSelector((state) => state.data.storage);

  return (
    <StorageContainer>
      <DroppableGroupList groups={storage} id={STORAGE} />
      <Droppable droppableId={PSEUDO_STORAGE}>
        {(provided) => (
          <PseudoStorage
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ zIndex: showPseudoDroppable ? 2 : -1 }}
          />
        )}
      </Droppable>
    </StorageContainer>
  );
};

export default Storage;
