import Course from "../types";
import {Draggable, DroppableProvided} from "react-beautiful-dnd";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import React, {MouseEventHandler} from "react";
import { createStyles, makeStyles} from "@material-ui/core";
import KusssLink from "./kusssLink";
import {useAppDispatch} from "../redux/hooks";
import CustomStudies from "./customStudies";
// import groups from '../data/groups.json'
import {moveCourse} from "../redux/data/data.actions";

const useStyles = makeStyles(() =>
    createStyles({
        list: {
            backgroundColor: "#ffffff",
            padding: "0.5rem"
        },
        item: {
            backgroundColor: "#cccccc",
            marginBottom: "0.5rem"
        },
        nested: {
            paddingLeft:"1rem",
        },
    }),
);

interface Props {
    courses: Course[],
    outerProvided: DroppableProvided,
    id: string
}


const CourseList = ({courses, outerProvided, id}: Props) => {

    const dispatch = useAppDispatch()

    const classes = useStyles()

    // const getGroup = (courseId: string) => {
    //     for (let group of groups as DataGroup[]) {
    //         if (group.courses.findIndex(c => c === courseId) !== -1) return group
    //     }
    // }
    //
    // const groupCourses = (courses: Course[]): (Course | Group)[] => {
    //
    //     const resultList: (Course | Group)[] = []
    //     for (let i = 0; i < courses.length; i++) {
    //
    //         const group = getGroup(courses[i].id);
    //         if (group === undefined) {
    //             resultList.push(courses[i]);
    //             continue;
    //         }
    //         const groupIndex = resultList.findIndex(r => r.id === group.id)
    //         if (groupIndex === -1) {
    //             // group doesnt exist yet
    //             resultList.push({id: group.id, title: group.title, courses: [courses[i]], type: "group"})
    //         } else {
    //             (resultList[groupIndex] as Group).courses.push(courses[i])
    //         }
    //     }
    //     return resultList
    // }
    //
    // const combinedArray: (Course | Group)[] = groupCourses(courses)
    //
    // console.log(combinedArray);

    return (
        <>
            <List disablePadding className={classes.list}>


                {/*{combinedArray.map((item, index) => {*/}



                {/*    if (item.type === "course") {*/}
                {/*        return (*/}
                {/*            <Draggable key={item.id} draggableId={item.id} index={index}>*/}
                {/*                {(provided) => {*/}
                {/*                    // const handleLeftClick: MouseEventHandler<HTMLLIElement> = (e) => {*/}
                {/*                    //     if (id !== "storage") {*/}
                {/*                    //         e.preventDefault()*/}
                {/*                    //         console.log(e)*/}
                {/*                    //         dispatch(moveCourse({*/}
                {/*                    //             courseId: c.id,*/}
                {/*                    //             destinationId: "storage",*/}
                {/*                    //             destinationIndex: 0,*/}
                {/*                    //             sourceIndex: index,*/}
                {/*                    //             sourceId: id*/}
                {/*                    //         }))*/}
                {/*                    //     }*/}
                {/*                    // }*/}
                {/*                    return (*/}
                {/*                        <ListItem*/}
                {/*                            // onContextMenu={handleLeftClick}*/}
                {/*                            className={classes.item}*/}
                {/*                            ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>*/}
                {/*                            <ListItemText>*/}
                {/*                                {item.kusssId !== "" ?*/}
                {/*                                    <KusssLink*/}
                {/*                                        id={item.kusssId}>{item.sign + " - " + item.title}*/}
                {/*                                    </KusssLink> :*/}
                {/*                                    (item.sign + " - " + item.title)}*/}
                {/*                            </ListItemText>*/}
                {/*                        </ListItem>*/}
                {/*                    )*/}
                {/*                }}*/}
                {/*            </Draggable>*/}
                {/*        )*/}

                {/*    }*/}

                {/*    return <GroupItem group={item} index={index}/>*/}
                {/*})}*/}

                {courses.map((c, index) => (


                    <Draggable key={c.id} draggableId={c.id} index={index}>
                        {(provided) => {
                            const handleLeftClick: MouseEventHandler<HTMLLIElement> = (e) => {
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
                                <ListItem
                                    onContextMenu={handleLeftClick}
                                    className={classes.item}
                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <ListItemText>
                                        {c.kusssId !== "" ? <KusssLink
                                            id={c.kusssId}>{c.sign + " - " + c.title}</KusssLink> : (c.sign + " - " + c.title)}
                                    </ListItemText>
                                </ListItem>
                            )
                        }}
                    </Draggable>
                ))}
                {outerProvided.placeholder}
                {id === "storage" ? null : <CustomStudies semesterIndex={Number(id.slice(3))}/>}
            </List>
        </>
    )
}

export default CourseList