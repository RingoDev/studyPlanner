import {createStyles, makeStyles, Tooltip, Typography, withStyles} from "@material-ui/core";
import {Draggable} from "react-beautiful-dnd";
import React, {MouseEventHandler} from "react";
import {moveCourse} from "../redux/data/data.actions";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import KusssLink from "./kusssLink";
import Course from "../types";
import {useAppDispatch} from "../redux/hooks";

const CourseItem = ({course, index, semesterId}: { course: Course, index: number, semesterId: string }) => {

    const dispatch = useAppDispatch()

    const useStyles = makeStyles(() =>
        createStyles({
            item: {
                backgroundColor: (!course.violations || course.violations.length === 0) ? "#cccccc" : "rgba(95,24,24,0.67)",
                marginBottom: "0.375rem",
                padding: "0.5rem"
            },
            nested: {
                paddingLeft: "1rem",
            },
        }),
    );

    const classes = useStyles()

    const HtmlTooltip = withStyles(() => ({
        arrow:{
            color: '#f5f5f9',
        },
        tooltip: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: "20rem",
            fontSize: "1rem",
            border: '1px solid #dadde9',
        },
    }))(Tooltip);

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

                if (course.violations && course.violations.length !== 0) {
                    return (
                        <HtmlTooltip arrow title={
                            <>
                                {course.violations.map((v, index) => {
                                    return (
                                        <Typography key={index}>{v.reason}</Typography>
                                    )
                                })}
                            </>
                        }>
                            <div>
                                <ListItem
                                    onContextMenu={handleLeftClick}
                                    className={classes.item}
                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <ListItemText>
                                        {course.kusssId !== "" ? <KusssLink
                                            id={course.kusssId}>{course.sign + " - " + course.title}</KusssLink> : (course.sign + " - " + course.title)}
                                    </ListItemText>
                                </ListItem>
                            </div>
                        </HtmlTooltip>
                    )
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
                    </ListItem>
                )
            }}
        </Draggable>
    )
}
export default CourseItem