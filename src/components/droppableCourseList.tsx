import {useDrop} from 'react-dnd'
import CourseList from "./courseList";
import React from "react";
import Course, {SemesterType} from "../types/types";
import {COMPOSITE_GROUP, COURSE, COURSE_GROUP} from "../types/dndTypes";
import {useAppDispatch} from "../redux/hooks";
import {moveCourse, moveGroup} from "../redux/data/data.actions";


interface Props {
    semester: SemesterType
    index: number
}

export interface CourseDrop {
    type: typeof COURSE
    payload: Course,
    sourceId: string,
}

export interface MultipleCourseDrop {
    type: typeof COMPOSITE_GROUP | typeof COURSE_GROUP
    payload: { id: string },
    sourceId: string,
}

const DroppableCourseList = ({semester, index}: Props) => {

    const dispatch = useAppDispatch()

    const [, drop] = useDrop<CourseDrop | MultipleCourseDrop, any, any>(() => ({
        accept: [COURSE, COMPOSITE_GROUP, COURSE_GROUP],
        drop: (dragObject, _) => {
            console.log(dragObject)
            if (dragObject.type === COURSE) {
                dispatch(moveCourse({
                    courseId: dragObject.payload.id,
                    sourceId: dragObject.sourceId,
                    destinationId: "sem" + index,
                }))
            } else if (dragObject.type === COMPOSITE_GROUP) {
                dispatch(moveGroup({
                    groupId: dragObject.payload.id,
                    destinationId: "sem" + index
                }))
            }
            else if (dragObject.type === COURSE_GROUP) {
                dispatch(moveGroup({
                    groupId: dragObject.payload.id,
                    destinationId: "sem" + index
                }))
            }
        }
    }))
    return (
        <div ref={drop} style={{
            border: semester.dropColor ? "2px solid " + semester.dropColor : "2px solid black",
            height: "100%"
        }}>
            <CourseList courses={semester.courses} id={"sem" + index}/>
        </div>
    )
}


export default DroppableCourseList