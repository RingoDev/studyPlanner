import {Group} from "../types/types";
import {COURSE_GROUP} from "../types/dndTypes";
import GroupItem from "./groupItem";
import {Draggable} from "react-beautiful-dnd";

interface Props {
    group: Group
    index: number
    containerId: string
    level: number,
    hide:boolean
}


const DraggableGroupItem = ({group, index, level,hide}: Props) => {

    if (group.type === COURSE_GROUP && group.courses.length === 0) {
        return <></>
    }

    return (
        <Draggable draggableId={"g_" + group.id} index={index}>
            {(provided) => {
                if(hide){
                    return(
                        <div ref={provided.innerRef}{...provided.draggableProps} {...provided.dragHandleProps} style={{display:"none"}}>
                            <GroupItem level={level} group={group} index={index}/>
                        </div>
                    )
                }
                return (
                    <div ref={provided.innerRef}{...provided.draggableProps} {...provided.dragHandleProps}>
                        <GroupItem level={level} group={group} index={index}/>
                    </div>
                )
            }}
        </Draggable>
    )
}

export default DraggableGroupItem