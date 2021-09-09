import {Draggable, Droppable} from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Course from "./types";

const Storage = ({storage}: { storage: Course[] }) => {
    return (

            <Droppable droppableId={"storage"}>
                {provided => (
                    <List {...provided.droppableProps} ref={provided.innerRef}>
                        {storage.map((course, index) => (
                            <Draggable key={course.id} draggableId={course.id} index={index}>
                                {(provided => {
                                    return (
                                        <ListItem
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