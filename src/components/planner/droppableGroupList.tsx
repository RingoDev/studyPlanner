import {Group} from "../../types/types";
import List from "@mui/material/List";
import React from "react";
import DraggableGroupItem from "./draggableGroupItem";
import {Droppable} from "react-beautiful-dnd";
import {STORAGE} from "../../types/dndTypes";
import {styled} from "@mui/material/styles";

interface Props {
    id: string
    groups: Group[]
}

const StyledList = styled(List)(({theme}) => ({
    padding: "0 0rem",
    height: "100%",
    overflowY: "auto",
    '&::-webkit-scrollbar': {
        width: '0.75em',
        backgroundColor: '#cccccc',
        borderRadius: "1em"
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.primary.light,
        borderRadius: "1em"
    }
}))

const DroppableGroupList = ({groups, id}: Props) => {

    return (
        <Droppable droppableId={id} isDropDisabled>
            {(provided) => (
                <StyledList ref={provided.innerRef} disablePadding{...provided.droppableProps}>
                    {groups.map((g, index) => <DraggableGroupItem
                        containerId={STORAGE}
                        key={g.id}
                        group={g}
                        index={index}
                        level={0}/>)}
                    {provided.placeholder}
                </StyledList>
            )}
        </Droppable>
    )
}

export default DroppableGroupList
