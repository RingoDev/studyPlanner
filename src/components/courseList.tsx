import Course from "../types";
import {Draggable, DroppableProvided} from "react-beautiful-dnd";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import React from "react";
import {createStyles,  makeStyles} from "@material-ui/core";
import KusssLink from "./kusssLink";

const useStyles = makeStyles(() =>
    createStyles({
        list: {
            backgroundColor: "#ffffff",
            padding: "0.5rem"
        },
        item: {
            backgroundColor: "#cccccc",
            marginBottom: "0.5rem"
        }
    }),
);


const CourseList = ({courses, outerProvided}: { courses: Course[], outerProvided: DroppableProvided }) => {

    const classes = useStyles()
    return (
        <>
            <List disablePadding className={classes.list}>
                {courses.map((c, index) => (
                    <Draggable key={c.id} draggableId={c.id} index={index}>
                        {(provided) => {
                            return (
                                <ListItem
                                    className={classes.item}
                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <ListItemText>
                                        {c.kusssId !== "" ? <KusssLink id={c.kusssId}>{c.type + " - " + c.title}</KusssLink> : (c.type + " - " + c.title)}
                                    </ListItemText>
                                </ListItem>
                            )
                        }}
                    </Draggable>
                ))}
                {outerProvided.placeholder}
            </List>
        </>
    )
}

export default CourseList