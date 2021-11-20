import { Button, ListItemIcon} from "@material-ui/core";
import React, {useRef,} from "react";
import Course from "../../types/types";
import {Check, X} from "lucide-react";
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
            <Button ref={ref} onClick={toggleFinished}> {course.finished ? <X/> : <Check/>}</Button>
            {/*<StyledMenu*/}
            {/*    anchorEl={ref.current}*/}
            {/*    open={open}*/}
            {/*    onClose={() => setOpen(false)}*/}
            {/*>*/}
            {/*    {*/}
            {/*        course.finished ? <MenuItem disableRipple onClick={() => handleFinish(false)}>*/}
            {/*                Abschließen*/}
            {/*                <X/>*/}
            {/*            </MenuItem>*/}
            {/*            : <MenuItem disableRipple onClick={() => handleFinish(true)}>*/}
            {/*                Abschließen*/}
            {/*                <Check/>*/}
            {/*            </MenuItem>*/}
            {/*    }*/}

            {/*    <MenuItem disableRipple onClick={() => setOpen(false)}>*/}
            {/*        Anrechnen*/}
            {/*        <Check/>*/}
            {/*    </MenuItem>*/}
            {/*</StyledMenu>*/}
        </ListItemIcon>
    )
}

export default CourseStateOption
