import { Droppable} from "react-beautiful-dnd";
import React from "react";
import CourseList from "./components/courseList";
import {useAppSelector} from "./redux/hooks";

const Storage = () => {

    const storage = useAppSelector((state) => state.data.storage)

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