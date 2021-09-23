import {createStyles,  makeStyles} from "@material-ui/core";
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
        <Draggable key={course.id} draggableId={course.id} index={index}>
            {(provided) => {
                const handleLeftClick: MouseEventHandler<HTMLLIElement | HTMLDivElement> = (e) => {
                    if (semesterId !== "storage") {
                        e.preventDefault()
                        console.log(e)
                        dispatch(moveCourse({
                            courseId: course.id,
                            destinationId: "storage",
                            destinationIndex: 0,
                            sourceIndex: index,
                            sourceId: semesterId
                        }))
                    }
                }

                return (
                    <ListItem
                        onContextMenu={handleLeftClick}
                        className={classes.item}
                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ListItemText>
                            {course.kusssId !== "" ? <KusssLink
                                id={course.kusssId}>{course.sign + " - " + course.title}</KusssLink> : (course.sign + " - " + course.title)}
                        </ListItemText>
                        <ConstraintIndicator course={course}/>
                    </ListItem>
                )
            }}
        </Draggable>
    )
}
export default CourseItem