import React, {useState} from 'react';
import {
    AppBar, Box, Button,
    Container,
    createStyles, FormControl, Grid,
    makeStyles, MenuItem, Modal, Select,
    Toolbar, Typography,
} from "@material-ui/core";
import {BeforeCapture, DragDropContext, DragStart, DropResult} from "react-beautiful-dnd";
import Curriculum from "./Curriculum";
import Storage from "./Storage";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {
    hideConstraintIndicators, lockDroppables,
    moveCourse,
    moveCourseInList, setStartSemester,
    showConstraintIndicators, unlockDroppables
} from "./redux/data/data.actions";
import {Link} from "react-router-dom";
import ConfigurationModal from "./components/configurationModal";



const Planner = () => {

    const dispatch = useAppDispatch()

    const [open,setOpen] = useState<boolean>(false)



    const handleDrop = (result: DropResult) => {

        dispatch(hideConstraintIndicators({}))
        dispatch(unlockDroppables({}))

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

        dispatch(lockDroppables({
            sourceId: dragStart.source.droppableId,
            draggableId: dragStart.draggableId,
        }))


    }

    const handleOnBeforeCapture = (before:BeforeCapture) => {
    }

    const useStyles = makeStyles(() =>
        createStyles({
            container: {
                padding: "2rem"
            },
            box: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                padding: "4rem",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                borderRadius: "1rem",
                minHeight: "50rem",
                background: "rgba( 255, 255, 255, 0.3 )",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
            },
            toolbar:{
                backgroundColor:"#99d98c"
            }
        }),
    )

    const classes = useStyles()


    return (
        <div className="App">
            <AppBar position={"static"}>
                <Toolbar className={classes.toolbar} >
                    <Button onClick={() => setOpen(!open)}>Configuration </Button>
                </Toolbar>
            </AppBar>
            <ConfigurationModal open={open} setOpen={setOpen}/>

            <Container className={classes.container} maxWidth={"xl"}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <DragDropContext onBeforeCapture={handleOnBeforeCapture} onDragEnd={(result) => handleDrop(result)} onDragStart={handleDragStart}>
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
