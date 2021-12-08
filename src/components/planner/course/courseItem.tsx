import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import KusssLink from "./kusssLink";
import Course from "../../../types/types";
import ConstraintIndicator from "./constraintIndicator";
import CourseStateOption from "./courseStateOption";
import Color from "color";

const CourseItem = ({course, isInStorage}: { course: Course, isInStorage: boolean }) => {

    const useStyles = makeStyles(() => {

        return createStyles({
            itemContainer: {
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                paddingBottom: "0.375rem"
            },
            item: {
                backgroundColor: course.finished ? Color(course.color).alpha(0.3).string() : course.color,
                padding: "0.5rem"
            },
            nestedlighten: {
                paddingLeft: "1rem",
            },
        })
    })

    const classes = useStyles()


    return (
        <div className={classes.itemContainer}>
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
                            <CourseStateOption course={course}/>
                        </>
                }

            </ListItem>
        </div>
    )
}
export default CourseItem
