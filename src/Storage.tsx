import { Droppable} from "react-beautiful-dnd";
import React from "react";
import Course from "./types";
import CourseList from "./components/courseList";

const Storage = ({storage}: { storage: Course[] }) => {
    return (
        <Droppable droppableId={"storage"}>
            {provided => (
                <div style={{height:"100%"}} {...provided.droppableProps}
                      ref={provided.innerRef}>
                    <CourseList courses={storage} outerProvided={provided}/>
                </div>
            )}
        </Droppable>
    )
}

export default Storage