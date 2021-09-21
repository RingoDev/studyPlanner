import Course from "../types";
import { DroppableProvided} from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import CustomStudies from "./customStudies";
import CourseItem from "./courseItem";


interface Props {
    courses: Course[],
    outerProvided: DroppableProvided,
    id: string
}


const useStyles = makeStyles(() =>
    createStyles({
        list: {
            backgroundColor: "#ffffff",
            padding: "0.5rem"
        },
    }),
);


const CourseList = ({courses, outerProvided, id}: Props) => {


    const classes = useStyles()

    return (
        <>
            <List disablePadding className={classes.list}>
                {courses.map((c, index) => <CourseItem key={c.id} course={c} index={index} semesterId={id}/>)}
                {outerProvided.placeholder}
                {id === "storage" ? null : <CustomStudies semesterIndex={Number(id.slice(3))}/>}
            </List>
        </>
    )
}

export default CourseList