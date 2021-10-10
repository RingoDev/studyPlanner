import {createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import KusssLink from "./kusssLink";
import Course from "../types/types";
import ConstraintIndicator from "./constraintIndicator";
import CourseOptions from "./courseOptions";

const CourseItem = ({course}: { course: Course, index: number, semesterId: string }) => {

    const useStyles = makeStyles(() => {
        let color = "#cccccc"
        if (course.color) color = course.color

        return createStyles({
            item: {
                backgroundColor: color,
                marginBottom: "0.375rem",
                padding: "0.5rem"
            },
            nested: {
                paddingLeft: "1rem",
            },
        })
    })

    const classes = useStyles()

    return (
        <ListItem className={classes.item}>
            <ListItemText>
                {course.finished ? "Done" : null}
                {course.kusssId !== "" ? <KusssLink
                    id={course.kusssId}>{course.sign + " - " + course.title}</KusssLink> : (course.sign + " - " + course.title)}
            </ListItemText>
            <ConstraintIndicator course={course}/>
            <CourseOptions course={course}/>
        </ListItem>
    )
}
export default CourseItem