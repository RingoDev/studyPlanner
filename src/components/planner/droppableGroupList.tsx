import {Group} from "../../types/types";
import List from "@mui/material/List";
import React from "react";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import DraggableGroupItem from "./draggableGroupItem";
import {Droppable} from "react-beautiful-dnd";

interface Props {
    id: string
    groups: Group[]
}


const useStyles = makeStyles(() =>
    createStyles({
        list: {
            padding: "0 0rem",
            height: "100%",
            overflowY: "auto",
            // width: "18vw",
            // margin: "0 auto",
            '&::-webkit-scrollbar': {
                width: '0.75em',
                backgroundColor: '#cccccc',
                borderRadius: "1em"
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#777777',
                borderRadius: "1em"
            }
        },
    }),
);


const DroppableGroupList = ({groups, id}: Props) => {
    const classes = useStyles()

    return (
        <>
            <Droppable droppableId={id} isDropDisabled>
                {(provided) => (
                    <List ref={provided.innerRef} disablePadding className={classes.list} {...provided.droppableProps}>
                        {
                            groups.map((g, index) => <DraggableGroupItem
                                containerId={"storage"}
                                key={g.id}
                                group={g}
                                index={index}
                                level={0}/>
                            )}
                        {provided.placeholder}
                    </List>
                )}
            </Droppable>
        </>
    )
}

export default DroppableGroupList
