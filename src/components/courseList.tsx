import Course from "../types/types";
import List from "@material-ui/core/List";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import CustomStudies from "./customStudies";
import DraggableCourseItem from "./draggableCourseItem";


interface Props {
    courses: Course[],
    id: string
}


const useStyles = makeStyles(() =>
    createStyles({
        list: {
            padding: "0.5rem"
        },
    }),
);


const CourseList = ({courses, id}: Props) => {

    // const dispatch = useAppDispatch()
    const classes = useStyles()

    return (
        <>
            <List disablePadding className={classes.list}>
                {courses.map((c, index) => (
                        // const handleLeftClick: MouseEventHandler<HTMLLIElement | HTMLDivElement> = (e) => {
                        //     if (id !== "storage") {
                        //         e.preventDefault()
                        //         console.log(e)
                        //         dispatch(moveCourse({
                        //             courseId: c.id,
                        //             destinationId: "storage",
                        //             destinationIndex: 0,
                        //             sourceIndex: index,
                        //             sourceId: id
                        //         }))
                        //     }
                        // }
                        <div>
                            <DraggableCourseItem course={c} index={index} semesterId={id}/>
                        </div>
                    )
                )}
                {id === "storage" ? null : <CustomStudies semesterIndex={Number(id.slice(3))}/>}
            </List>
        </>
    )
}

export default CourseList