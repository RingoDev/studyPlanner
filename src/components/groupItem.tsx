import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {ChevronDown, ChevronUp} from "lucide-react";
import {Collapse, createStyles, ListItemIcon, makeStyles} from "@material-ui/core";
import List from "@material-ui/core/List";
import React, {useState} from "react";
import {Group} from "../types/types";
import DraggableCourseItem from "./draggableCourseItem";
import xOutOfYConstraints from "../data/xOutOfYConstraints.json"
import groups from "../data/groups.json"


const GroupItem = ({group}: { group: Group, index: number }) => {


    const getMaxCourses = groups.find(g => g.id === group.id)?.courses.length || 0

    const unbookedEcts = group.courses.map(c => c.ects).reduce((e1, e2) => e1 + e2, 0)

    const maxEcts = xOutOfYConstraints.find(c => c.group === group.id)?.maxEcts || 0


    const allEcts = xOutOfYConstraints.find(c => c.group === group.id)?.allEcts || 0

    console.log("unbooked Ects: " + unbookedEcts + " for groupid: " + group.id)
    console.log("max booked Ects: " + maxEcts + " for groupid: " + group.id)

    const [open, setOpen] = useState(false)

    const useStyles = makeStyles(() =>
        createStyles({
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
                        {group.courses.length}/{getMaxCourses}
                    </ListItemIcon>
                    <ListItemIcon>
                        {open ? <ChevronUp/> : <ChevronDown/>}
                    </ListItemIcon>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div style={{height: "100%"}}>
                        <List component="div" disablePadding>
                            {group.courses.map((course, cIndex) => {
                                return (
                                    <div key={course.id}>
                                        <DraggableCourseItem course={{
                                            ...course,
                                            color: allEcts - unbookedEcts >= maxEcts ? "#cccccc" : group.color
                                        }} index={cIndex} containerId={group.id}/>
                                    </div>
                                )
                            })}
                        </List>
                    </div>
                </Collapse>
            </div>
        </>
    )
}

export default GroupItem