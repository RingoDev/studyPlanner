import Course from "../types";
import {Draggable, DroppableProvided} from "react-beautiful-dnd";
import List from "@material-ui/core/List";
import React, {MouseEventHandler} from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import CustomStudies from "./customStudies";
import CourseItem from "./courseItem";
import {moveCourse} from "../redux/data/data.actions";
import {useAppDispatch} from "../redux/hooks";


interface Props {
    courses: Course[],
    outerProvided: DroppableProvided,
    id: string
}



const useStyles = makeStyles(() =>
    createStyles({
        list: {
            padding: "0.5rem"
        },
    }),
);


const CourseList = ({courses, outerProvided, id}: Props) => {

    const dispatch = useAppDispatch()
    const classes = useStyles()

    return (
        <>
            <List disablePadding className={classes.list}>
                {courses.map((c, index) => (
                        <Draggable key={c.id} draggableId={c.id} index={index}>
                            {(provided) => {
                                const handleLeftClick: MouseEventHandler<HTMLLIElement | HTMLDivElement> = (e) => {
                                    if (id !== "storage") {
                                        e.preventDefault()
                                        console.log(e)
                                        dispatch(moveCourse({
                                            courseId: c.id,
                                            destinationId: "storage",
                                            destinationIndex: 0,
                                            sourceIndex: index,
                                            sourceId: id
                                        }))
                                    }
                                }
                                return (
                                    <div onContextMenu={handleLeftClick}
                                         ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <CourseItem key={c.id} course={c} index={index} semesterId={id}/>
                                    </div>
                                )
                            }}
                        </Draggable>


                    )
                )}
                {outerProvided.placeholder}
                {id === "storage" ? null : <CustomStudies semesterIndex={Number(id.slice(3))}/>}
            </List>
        </>
    )
}

export default CourseList