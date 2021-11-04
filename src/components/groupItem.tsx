import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {ChevronDown, ChevronUp} from "lucide-react";
import {Collapse, createStyles, ListItemIcon, makeStyles} from "@material-ui/core";
import List from "@material-ui/core/List";
import React, {useState} from "react";
import {Group} from "../types/types";
import DraggableCourseItem from "./draggableCourseItem";
import {useAppSelector} from "../redux/hooks";
import {getCoursesFromGroups, getGroupWithIdFromGroups} from "../data";
import {COURSE_GROUP} from "../types/dndTypes";
import DraggableGroupItem from "./draggableGroupItem";
import {Droppable} from "react-beautiful-dnd";


const GroupItem = ({group, level}: { group: Group, index: number, level: number }) => {

    const groups = useAppSelector((state) => state.data.initialConfig.groups)
    const xOutOfYConstraints = useAppSelector((state) => state.data.initialConfig.constraints.xOutOfYConstraints)

    const groupWithSameId = getGroupWithIdFromGroups(groups, group.id)
    const getMaxCourses = groupWithSameId !== undefined ? getCoursesFromGroups([groupWithSameId]).length || 0 : 0

    const unbookedEcts = getCoursesFromGroups([group]).map(c => c.ects).reduce((e1, e2) => e1 + e2, 0)

    const maxEcts = xOutOfYConstraints.find(c => c.group === group.id)?.maxEcts || 0


    const allEcts = xOutOfYConstraints.find(c => c.group === group.id)?.allEcts || 0


    const [open, setOpen] = useState(false)

    const useStyles = makeStyles(() =>
        createStyles({
            collapsedDiv: {
                paddingLeft: String(Math.round((level + 1) * 0.5 * 10) / 10) + "rem",
            },
            list: {
                backgroundColor: "#ffffff",
                padding: "0.5rem"
            },
            div: {

                marginBottom: "0.5rem"
            },
            item: {
                backgroundColor: allEcts - unbookedEcts >= maxEcts ? "#cccccc" : group.color,
                marginBottom: "0.375rem",
                '&:hover': {
                    backgroundColor: allEcts - unbookedEcts >= maxEcts ? "#cccccc" : group.color,
                }
            },
            nested: {
                paddingLeft: "2rem",
            },
        }),
    );

    const classes = useStyles()

    return (
        <>
            <div className={classes.div}>
                <ListItem className={classes.item} button onClick={() => setOpen(!open)}>
                    <ListItemText>
                        {group.title}
                    </ListItemText>
                    <ListItemIcon>
                        {group.type === COURSE_GROUP ?
                            group.courses.length :
                            getCoursesFromGroups([group]).length}/{getMaxCourses}
                    </ListItemIcon>
                    <ListItemIcon>
                        {open ? <ChevronUp/> : <ChevronDown/>}
                    </ListItemIcon>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div className={classes.collapsedDiv} style={{height: "100%"}}>
                        <Droppable droppableId={group.id} isDropDisabled>
                            {provided => (
                                <List component="div" disablePadding ref={provided.innerRef} {...provided.droppableProps}>
                                    {group.type === COURSE_GROUP ?
                                        group.courses.map((course, cIndex) => (
                                            <div key={course.id}>
                                                <DraggableCourseItem course={{
                                                    ...course,
                                                    color: allEcts - unbookedEcts >= maxEcts ? "#cccccc": group.color
                                                }} index={cIndex} containerId={group.id}/>
                                            </div>
                                        ))

                                        :
                                        group.groups.map((group, cIndex) => (
                                            <div key={group.id}>
                                                <DraggableGroupItem
                                                    level={level + 1}
                                                    group={{
                                                        ...group,
                                                        color: allEcts - unbookedEcts >= maxEcts ? "#cccccc" : group.color
                                                    }} index={cIndex} containerId={group.id}/>
                                            </div>
                                        ))}
                                    {provided.placeholder}
                                </List>


                            )}

                        </Droppable>
                    </div>
                </Collapse>
            </div>
        </>
    )
}

export default GroupItem