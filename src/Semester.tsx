import {Draggable, Droppable} from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import {SemesterType} from "./App";

const Semester = ({semester}: { semester: SemesterType }) => {
    return (

                <div style={{position: "relative",padding: "3rem 1rem 3rem 1rem", height: "100%"}}>
                    <div style={{
                        fontSize: "2.25rem",
                        position: "absolute",
                        top: "8rem",
                        left: "-2rem",
                        transform: "rotate(270deg)"
                    }}>Semester {semester.id}</div>
                    <div style={{position: "relative", paddingLeft: "4rem", height: "100%"}}>
                        <Droppable droppableId={semester.id} >
                            {(provided) => (
                        <div style={{border: "1px solid black", height: "100%"}}  {...provided.droppableProps}
                             ref={provided.innerRef}>
                            <List disablePadding>
                                {semester.courses.map((c, index) => (
                                    <Draggable key={c.id} draggableId={c.id} index={index}>
                                        {(provided) => {
                                            return (
                                                <ListItem
                                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <ListItemText>
                                                        {c.type} - {c.title}
                                                    </ListItemText>
                                                </ListItem>
                                            )
                                        }}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        </div>
                            )}
                        </Droppable>
                    </div>
                </div>

    )
}

export default Semester