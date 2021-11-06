import React from "react";
import {useAppSelector} from "./redux/hooks";
import DroppableGroupList from "./components/droppableGroupList";
import {createStyles, makeStyles} from "@material-ui/core";
import {Droppable} from "react-beautiful-dnd";


interface Props {
    showPseudoDroppable: boolean
}

const Storage = ({showPseudoDroppable}: Props) => {


    const useStyles = makeStyles(() =>
        createStyles({
            container: {
                height: "100%",
                borderRadius: "1em",
                position: "relative"
            },
            pseudo: {
                border: "outline 4px dashed #cccccc",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: showPseudoDroppable ? 2 : -1,
                height: "100%",
                width: "calc(100% - 0.5em)",
                backgroundColor:  "#ffffff88",
                transition: "color 5s"
            }
        })
    )

    const storage = useAppSelector((state) => state.data.storage)
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <DroppableGroupList groups={storage} id={"storage"} hideItems={false}/>
            <Droppable droppableId={"pseudo_storage"}>{
                provided => {
                    return <div ref={provided.innerRef} {...provided.droppableProps} className={classes.pseudo}/>
                }
            }
            </Droppable>
        </div>
    )
}

export default Storage