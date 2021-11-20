import {Button, ListItemIcon} from "@material-ui/core";
import React, {useRef,} from "react";
import Course from "../../types/types";
import {Check, X, Square, CheckSquare} from "lucide-react";
import {useAppDispatch} from "../../redux/hooks";
import {setCourseFinished, setCourseUnfinished} from "../../redux/data/data.actions";


const CourseStateOption = ({course}: { course: Course }) => {


    const dispatch = useAppDispatch()

    const ref = useRef<HTMLButtonElement>(null);


    const toggleFinished = () => {
        if (course.finished) {
            dispatch(setCourseUnfinished({courseId: course.id}))
        } else {
            dispatch(setCourseFinished({courseId: course.id}))
        }
    }


    return (
        <ListItemIcon>
            <Button ref={ref} onClick={toggleFinished}>
                {course.finished ? <CheckSquare/> : <Square/>}
            </Button>
        </ListItemIcon>
    )
}

export default CourseStateOption
