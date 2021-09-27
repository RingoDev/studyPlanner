import React from 'react';
import {
    AppBar,
    Container,
    createStyles,
    makeStyles,
    Toolbar,
} from "@material-ui/core";
import {DragDropContext, DragStart, DropResult} from "react-beautiful-dnd";
import Curriculum from "./Curriculum";
import Storage from "./Storage";
import {useAppDispatch} from "./redux/hooks";
import {
    hideConstraintIndicators,
    moveCourse,
    moveCourseInList,
    showConstraintIndicators
} from "./redux/data/data.actions";

import {Link} from 'react-router-dom'


const Planner = () => {

    const dispatch = useAppDispatch()

    const handleDrop = (result: DropResult) => {

        dispatch(hideConstraintIndicators({}))

        console.log(result)
        const destination = result.destination
        if (destination === undefined || destination === null) return;

        if (result.source.droppableId === destination.droppableId) {
            dispatch(moveCourseInList({
                listId: result.source.droppableId,
                courseId: result.draggableId,
                sourceIndex: result.source.index,
                destinationIndex: destination.index
            }));
        } else {
            dispatch(moveCourse({
                sourceId: result.source.droppableId,
                destinationId: destination.droppableId,
                courseId: result.draggableId,
                sourceIndex: result.source.index,
                destinationIndex: destination.index
            }))
        }

    }

    const handleDragStart = (dragStart: DragStart) => {
        console.log(dragStart)

        dispatch(showConstraintIndicators({
            sourceId: dragStart.source.droppableId,
            courseId: dragStart.draggableId,
            sourceIndex: dragStart.source.index
        }))

    }

    const useStyles = makeStyles(() =>
        createStyles({
            container: {
                padding: "2rem"
            }
        }),
    )

    const classes = useStyles()


    return (
        <div className="App">
            <AppBar position={"static"}>
                <Toolbar>
                    <Link to="/configuration">Settings</Link>
                </Toolbar>
            </AppBar>
            <Container className={classes.container} maxWidth={"xl"}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <DragDropContext onDragEnd={(result) => handleDrop(result)} onDragStart={handleDragStart}>
                        <div style={{
                            maxHeight: "90vh",
                            height: "85vh",
                            overflowY: "auto",
                            flex: "0 1 20%",
                            backgroundColor: "#dddddd"
                        }}>
                            <Storage/>
                        </div>
                        <div style={{
                            flex: "1 1 70%",
                            maxHeight: "90vh",
                            height: "85vh",
                            overflowY: "auto",
                        }}>
                            <Curriculum/>
                        </div>
                    </DragDropContext>
                </div>
            </Container>
        </div>
    );
}

export default Planner;
