import  {Group} from "../types/types";
import List from "@material-ui/core/List";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import DraggableGroupItem from "./draggableGroupItem";

interface Props {
    groups: Group[]
}


const useStyles = makeStyles(() =>
    createStyles({
        list: {
            padding: "0.5rem"
        },
    }),
);


const GroupList = ({groups}: Props) => {
    const classes = useStyles()

    return (
        <>
            <List disablePadding className={classes.list}>
                {groups.map((g, index) => <DraggableGroupItem
                    key={g.id}
                    group={g}
                    index={index}/>)}
            </List>
        </>
    )
}

export default GroupList