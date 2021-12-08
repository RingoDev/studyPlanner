import React, {useState} from 'react';
import Curriculum from "./Curriculum";
import Storage from "./Storage";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {moveCourse, moveGroup} from "../../redux/data/data.actions";
import {useAppDispatch} from "../../redux/hooks";
import {styled} from "@mui/styles";


const MainContainer = styled("div")(() => ({
    padding: "5vh 2rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "90vh",
    maxWidth: "1536px",

}))

const StorageContainer = styled("div")(() => ({
    flex: "0 1 25%",
    borderRadius: "1em",
    paddingLeft: "1rem",
    padding: "0.5rem",
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
    backgroundColor: "#dddddd"
}))

const CurriculumContainer = styled("div")(() => ({
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
}))


const Planner = () => {

    const dispatch = useAppDispatch()

    const [showPseudoDroppable, setShowPseudoDroppable] = useState<boolean>(false)

    const handleDragStart = () => {
        setShowPseudoDroppable(true)
        // if (isSemesterId(source.droppableId)) {
        //     create pseudo droppable over storage to be able to catch course drops back to storage
        // }
    }

    const handleDragEnd = ({destination, draggableId, source}: DropResult) => {
        if (showPseudoDroppable) setShowPseudoDroppable(false)
        if (destination === undefined || destination === null) return
        if (draggableId.startsWith("c_")) {
            dispatch(moveCourse({
                courseId: draggableId.slice(2),
                sourceId: source.droppableId,
                destinationId: destination.droppableId,
                destinationIndex: destination.index
            }))
            return
        } else if (draggableId.startsWith("g_")) {
            dispatch(moveGroup({
                destinationId: destination.droppableId,
                groupId: draggableId.slice(2),
                destinationIndex: destination.index
            }))
            return
        } else {
            console.error("wrong draggable id format: ", draggableId)
        }
    }

    return (
        <div className="App">
            <DragDropContext onDragEnd={handleDragEnd} onBeforeDragStart={handleDragStart}>
                <MainContainer>
                    <StorageContainer>
                        <Storage showPseudoDroppable={showPseudoDroppable}/>
                    </StorageContainer>
                    <CurriculumContainer>
                        <Curriculum/>
                    </CurriculumContainer>
                </MainContainer>
            </DragDropContext>
        </div>
    );
}

export default Planner;
