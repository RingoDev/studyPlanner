import  {Group} from "../types/types";
import List from "@material-ui/core/List";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import DraggableGroupItem from "./draggableGroupItem";
import {useAppDispatch} from "../redux/hooks";
import {useDrop} from "react-dnd";
import {COURSE} from "../types/dndTypes";
import {moveCourse} from "../redux/data/data.actions";
import {CourseDrop} from "./droppableCourseList";

interface Props {
    groups: Group[]
}


const useStyles = makeStyles(() =>
    createStyles({
        list: {
            padding: "0.5rem",
            height:"100%"
        },
    }),
);


const DroppableGroupList = ({groups}: Props) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const [, drop] = useDrop<CourseDrop | Group, any, any>(() => ({
        accept: [COURSE],
        drop: (dragObject, _) => {
            if (dragObject.type === COURSE) {
                dispatch(moveCourse({
                    courseId: dragObject.payload.id,
                    sourceId: dragObject.sourceId,
                    destinationId: "storage",
                    sourceIndex: dragObject.sourceIndex,
                    destinationIndex: 0
                }))
            }

        }
    }))

    return (
        <>
            <List ref={drop} disablePadding className={classes.list}>
                {groups.map((g, index) => <DraggableGroupItem
                    key={g.id}
                    group={g}
                    index={index}/>)}
            </List>
        </>
    )
}

export default DroppableGroupList