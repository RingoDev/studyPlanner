import {createStyles, makeStyles} from "@material-ui/core";
import {Draggable} from "react-beautiful-dnd";
import React, {MouseEventHandler} from "react";
import {moveCourse} from "../redux/data/data.actions";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import KusssLink from "./kusssLink";
import Course from "../types";
import {useAppDispatch} from "../redux/hooks";
import ConstraintIndicator from "./constraintIndicator";

const CourseItem = ({course, index, semesterId}: { course: Course, index: number, semesterId: string }) => {

    const dispatch = useAppDispatch()

    const useStyles = makeStyles(() => {
        let color = "#cccccc"
        if (course.color) color = course.color
        // if(course.violations && course.violations.length !== 0) color = "rgba(95,24,24,0.67)"

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
                {course.kusssId !== "" ? <KusssLink
                    id={course.kusssId}>{course.sign + " - " + course.title}</KusssLink> : (course.sign + " - " + course.title)}
            </ListItemText>
            <ConstraintIndicator course={course}/>
        </ListItem>
    )
}
export default CourseItem