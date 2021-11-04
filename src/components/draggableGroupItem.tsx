import {Group} from "../types/types";
import {COURSE_GROUP} from "../types/dndTypes";
import GroupItem from "./groupItem";
import {Draggable} from "react-beautiful-dnd";

interface Props {
    group: Group
    index: number
    containerId: string
    level: number
}


const DraggableGroupItem = ({group, index, level}: Props) => {

    if (group.type === COURSE_GROUP && group.courses.length === 0) {
        return <></>
    }

    return (
        <Draggable draggableId={"g_" + group.id} index={index}>
            {(provided) => (
                <div ref={provided.innerRef}
                     style={{cursor: "pointer"}}{...provided.draggableProps} {...provided.dragHandleProps} >
                    <GroupItem level={level} group={group} index={index}/>
                </div>
            )}
        </Draggable>
    )
}

export default DraggableGroupItem