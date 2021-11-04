import React from 'react';
import {Container, createStyles, makeStyles,} from "@material-ui/core";
import Curriculum from "./Curriculum";
import Storage from "./Storage";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {moveCourse, moveGroup} from "./redux/data/data.actions";
import {useAppDispatch} from "./redux/hooks";

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            padding: "5vh 2rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "90vh",
        },
        currContainer: {
            flex: "1 1 70%",
            overflowY: "auto",
            '&::-webkit-scrollbar': {
                width: '0.75em',
                backgroundColor: '#555555',
                outline: '1px solid #444444',
                borderRadius: "1em"
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#777777',
                borderRadius: "1em"
            }
        },
        storageContainer: {
            flex: "0 1 25%",
            borderRadius: "1em",
            paddingLeft:"1rem",
            padding:"0.5rem",
            paddingBottom:"1.5rem",
            backgroundColor: "#dddddd"
        }
    })
)

const Planner = () => {

    const dispatch = useAppDispatch()

    const classes = useStyles()

    const handleDragEnd = ({destination, draggableId, source}: DropResult) => {
        if (destination === undefined || destination === null) return

        if (draggableId.startsWith("c_")) {
            dispatch(moveCourse({
                courseId: draggableId.slice(2),
                sourceId: source.droppableId,
                destinationId: destination.droppableId,
            }))
            return
        } else if (draggableId.startsWith("g_")) {
            dispatch(moveGroup({
                destinationId: destination.droppableId,
                groupId: draggableId.slice(2)
            }))
            return
        } else {
            console.error("wrong draggable id format: ", draggableId)
        }
    }

    return (
        <div className="App">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Container className={classes.container} maxWidth={"xl"}>
                    <div className={classes.storageContainer}>
                        <Storage/>
                    </div>
                    <div className={classes.currContainer}>
                        <Curriculum/>
                    </div>
                </Container>
            </DragDropContext>
        </div>
    );
}

export default Planner;
