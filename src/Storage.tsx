import React from "react";
import {useAppSelector} from "./redux/hooks";
import DroppableGroupList from "./components/droppableGroupList";
import {createStyles, makeStyles} from "@material-ui/core";


const useStyles = makeStyles(() =>
    createStyles({
        container: {
            height: "100%",
            // overflowY: "auto",
            borderRadius: "1em",

        },
    })
)


const Storage = () => {

    const storage = useAppSelector((state) => state.data.storage)

    const classes = useStyles()

    return (
        <div className={classes.container}>
            <DroppableGroupList groups={storage} id={"storage"}/>
        </div>
    )
}

export default Storage