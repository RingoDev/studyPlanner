import React from "react";
import {useAppSelector} from "../../redux/hooks";
import DroppableGroupList from "./droppableGroupList";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
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
                top: "-1.5rem",
                left: "-1rem",
                zIndex: showPseudoDroppable ? 2 : -1,
                height: "calc(100% + 3rem)",
                width: "calc(100% + 1.5rem)",
                backgroundColor:  "#ffffff88",
                transition: "color 5s",
                backdropFilter: "blur(5px)",
                borderRadius: "1em",
            }
        })
    )

    const storage = useAppSelector((state) => state.data.storage)
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <DroppableGroupList groups={storage} id={"storage"}/>
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
