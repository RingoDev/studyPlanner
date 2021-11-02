import {createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import KusssLink from "./kusssLink";
import Course from "../types/types";
import ConstraintIndicator from "./constraintIndicator";
import CourseOptions from "./courseOptions";

const CourseItem = ({course, isInStorage}: { course: Course, isInStorage: boolean }) => {

    const useStyles = makeStyles(() => {

        return createStyles({
            item: {
                backgroundColor: course.finished ? course.color.alpha(0.3).string() : course.color.string(),
                marginBottom: "0.375rem",
                padding: "0.5rem"
            },
            nestedlighten: {
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
            {
                isInStorage ?
                    null :
                    <>
                        <ConstraintIndicator course={course}/>
                        <CourseOptions course={course}/>
                    </>
            }

        </ListItem>
    )
}
export default CourseItem