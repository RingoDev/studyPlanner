import React from "react";
import { useAppSelector } from "../../../lib/hooks/redux-hooks";
import GroupListDroppable from "./group-list-droppable";
import { Droppable } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";
import { PSEUDO_STORAGE, STORAGE } from "../../../types/dndTypes";

interface Props {
  showPseudoDroppable: boolean;
}

const StorageContainer = styled("div")(() => ({
  borderRadius: "1em",
  paddingLeft: "1rem",
  padding: "0.5rem",
  paddingTop: "1.5rem",
  paddingBottom: "1.5rem",
  backgroundColor: "#dddddd",
  height: "100%",
  position: "relative",
}));

const PseudoStorage = styled("div")(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  backgroundColor: "#ffffff88",
  backdropFilter: "blur(5px)",
  borderRadius: "1em",
}));

const Storage = ({ showPseudoDroppable }: Props) => {
  const storage = useAppSelector((state) => state.data.storage);

  return (
    <StorageContainer>
      <GroupListDroppable groups={storage} id={STORAGE} />
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
