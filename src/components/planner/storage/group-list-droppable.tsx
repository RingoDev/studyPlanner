import { Group } from "../../../types/types";
import List from "@mui/material/List";
import React from "react";
import GroupItemDraggable from "./group-item-draggable";
import { Droppable } from "react-beautiful-dnd";
import { STORAGE } from "../../../types/dndTypes";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "../../../redux/hooks";
import { groupMatchesSearch } from "../../../lib/search";

interface Props {
  id: string;
  groups: Group[];
}

const StyledList = styled(List)(() => ({
  padding: "0 0rem",
  height: "100%",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.75em",
    backgroundColor: "#cccccc",
    borderRadius: "1em",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#aaaaaa",
    borderRadius: "1em",
  },
}));

const GroupListDroppable = ({ groups, id }: Props) => {
  const searchText = useAppSelector((state) => state.data.searchText);

  return (
    <Droppable droppableId={id} isDropDisabled>
      {(provided) => (
        <StyledList
          ref={provided.innerRef}
          disablePadding
          {...provided.droppableProps}
        >
          {groups.map((g, index) => {
            if (groupMatchesSearch(g, searchText))
              return (
                <GroupItemDraggable
                  containerId={STORAGE}
                  key={g.id}
                  group={g}
                  index={index}
                  level={0}
                />
              );
            return null;
          })}
          {provided.placeholder}
        </StyledList>
      )}
    </Droppable>
  );
};

export default GroupListDroppable;
