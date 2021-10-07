import { useDrop} from 'react-dnd'
import CourseList from "./courseList";
import React from "react";
import Course, {Group, SemesterType} from "../types/types";
import {COURSE, GROUP} from "../types/dndTypes";
import {useAppDispatch} from "../redux/hooks";
import {moveCourse} from "../redux/data/data.actions";


interface Props {
    semester: SemesterType
    index: number
}

export interface CourseDrop {
    type: typeof COURSE
    payload: Course,
    sourceId: string,
    sourceIndex: number
}

const DroppableCourseList = ({semester, index}: Props) => {

    const dispatch = useAppDispatch()

    const [, drop] = useDrop<CourseDrop | Group, any, any>(() => ({
        accept: [COURSE, GROUP],
        drop: (dragObject,_) => {
            if (dragObject.type === COURSE) {
                dispatch(moveCourse({
                    courseId: dragObject.payload.id,
                    sourceId: dragObject.sourceId,
                    destinationId: "sem" + index,
                    sourceIndex: dragObject.sourceIndex,
                    destinationIndex: 0
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