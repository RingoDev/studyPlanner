import {Draggable, Droppable} from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import {SemesterType} from "./App";
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


const Semester = ({semester}: { semester: SemesterType }) => {

    const classes = useStyles()

    return (

        <div style={{position: "relative", padding: "3rem 1rem 3rem 1rem", height: "100%"}}>
            <div style={{
                fontSize: "2.25rem",
                position: "absolute",
                top: "8rem",
                left: "-2rem",
                transform: "rotate(270deg)"
            }}>Semester {semester.number+1}</div>
            <div style={{position: "relative", paddingLeft: "4rem", height: "100%"}}>
                <Droppable droppableId={semester.id}>
                    {(provided) => (
                        <div style={{
                            border: semester.dropColor ? "5px dashed " + semester.dropColor : "1px solid black",
                            height: "100%"
                        }}  {...provided.droppableProps}
                             ref={provided.innerRef}>
                            <List disablePadding className={classes.list}>
                                {semester.courses.map((c, index) => (
                                    <Draggable key={c.id} draggableId={c.id} index={index}>
                                        {(provided) => {
                                            return (
                                                <ListItem
                                                    className={classes.item}
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