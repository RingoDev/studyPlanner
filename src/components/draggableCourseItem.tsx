import Course from "../types/types";
import { useDrag} from "react-dnd";
import CourseItem from "./courseItem";
import {COURSE} from "../types/dndTypes";
import {CourseDrop} from "./droppableCourseList";

interface Props {
    course: Course
    index: number
    semesterId: string
}


const DraggableCourseItem = ({course, index, semesterId}: Props) => {
    const [collected, drag, dragPreview] = useDrag<CourseDrop, any, { isDragging: boolean }>(() => ({
        type: COURSE,
        item: {type: COURSE, payload: course, sourceId: semesterId, sourceIndex: index},
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }))

    return collected.isDragging ? (
        <div ref={dragPreview}/>
    ) : (
        <div ref={drag} {...collected} style={{cursor: "pointer"}}>
            <CourseItem course={course} index={index} semesterId={semesterId}/>
        </div>
    )
}

export default DraggableCourseItem