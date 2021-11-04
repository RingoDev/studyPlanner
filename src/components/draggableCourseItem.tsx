import Course from "../types/types";
import CourseItem from "./courseItem";
import {Draggable} from "react-beautiful-dnd";

interface Props {
    course: Course
    index: number
    containerId: string
}


const DraggableCourseItem = ({course, containerId, index}: Props) => {
    // const [collected, drag,] = useDrag<CourseDrop, any, unknown>(() => ({
    //     type: COURSE,
    //     item: {type: COURSE, payload: course, sourceId: containerId}
    // }))


    return (
        <Draggable draggableId={"c_" + course.id} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} style={{cursor: "pointer"}} {...provided.draggableProps} {...provided.dragHandleProps}
                     >
                    <CourseItem isInStorage={!containerId.startsWith("sem")} course={course}/>
                </div>
            )}
        </Draggable>
    )
}

export default DraggableCourseItem