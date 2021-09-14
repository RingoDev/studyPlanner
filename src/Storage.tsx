import {Draggable, Droppable} from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Course from "./types";
import {createStyles, makeStyles} from "@material-ui/core";


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

const Storage = ({storage}: { storage: Course[] }) => {
    const classes = useStyles();
    return (
        <Droppable droppableId={"storage"}>
            {provided => (
                <List
                    className={classes.list}
                    {...provided.droppableProps} ref={provided.innerRef}>
                    {storage.map((course, index) => (
                        <Draggable key={course.id} draggableId={course.id} index={index}>
                            {(provided => {
                                return (
                                    <ListItem
                                        className={classes.item}
                                        style={{backgroundColor: "#ffffff"}}
                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <ListItemText
                                            primary={course.type + " - " + course.title}
                                        />
                                    </ListItem>
                                )
                            })}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </List>
            )}

        </Droppable>

    )
}

export default Storage