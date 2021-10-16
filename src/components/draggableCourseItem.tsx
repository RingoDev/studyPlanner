import Course from "../types/types";
import { useDrag} from "react-dnd";
import CourseItem from "./courseItem";
import {COURSE} from "../types/dndTypes";
import {CourseDrop} from "./droppableCourseList";

interface Props {
    course: Course
    index: number
    containerId: string
}


const DraggableCourseItem = ({course, index, containerId}: Props) => {
    const [collected, drag,] = useDrag<CourseDrop, any, unknown>(() => ({
        type: COURSE,
        item: {type: COURSE, payload: course, sourceId: containerId}
    }))

    return (
        <div ref={drag} {...collected} style={{cursor: "pointer"}}>
            <CourseItem course={course} index={index} semesterId={containerId}/>
        </div>
    )
}

export default DraggableCourseItem