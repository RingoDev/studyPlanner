import React from "react";
import Course, {SemesterType} from "../../types/types";
import {COMPOSITE_GROUP, COURSE, COURSE_GROUP} from "../../types/dndTypes";
import {Droppable} from "react-beautiful-dnd";
import List from "@mui/material/List";
import DraggableCourseItem from "./course/draggableCourseItem";
import CustomStudies from "./customStudies";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';


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

const useStyles = makeStyles(() =>
    createStyles({
        list: {
            paddingTop: "0.5rem",
            // width: "18vw",
            //
            // margin: "0 auto",
        },
    }),
);

const DroppableCourseList = ({semester, index}: Props) => {

    const classes = useStyles()

    return (
        <Droppable droppableId={"sem" + index}>
            {provided => (
                <div ref={provided.innerRef} style={{
                    border: semester.dropColor ? "2px solid " + semester.dropColor : "2px solid #888888",
                    height: "100%"
                }}  {...provided.droppableProps} >
                    <List disablePadding className={classes.list}>
                        {semester.courses.map((c, index) => (
                                <div key={c.id}>
                                    <DraggableCourseItem course={c} index={index} containerId={"sem" + index}/>
                                </div>
                            )
                        )}
                        {provided.placeholder}
                        <CustomStudies semesterIndex={index}/>
                    </List>
                </div>
            )}
        </Droppable>
    )
}


export default DroppableCourseList
