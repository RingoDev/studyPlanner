import {Group} from "../types/types";
import {useDrag} from "react-dnd";
import {COURSE_GROUP, STORAGE} from "../types/dndTypes";
import GroupItem from "./groupItem";
import {MultipleCourseDrop} from "./droppableCourseList";

interface Props {
    group: Group
    index: number
    containerId: string
    level:number
}


const DraggableGroupItem = ({group, index, level}: Props) => {
    const [collected, drag,] = useDrag<MultipleCourseDrop, any, { isDragging: boolean }>(() => {
        return {
            type: group.type,
            item: {type: group.type, payload: {id: group.id}, sourceId: STORAGE},
        }
    })


    if (group.type === COURSE_GROUP && group.courses.length === 0) {
            return <></>
    }

    return (
        <div ref={drag} {...collected} style={{cursor: "pointer"}}>
            <GroupItem level={level} group={group} index={index}/>
        </div>
    )
}

export default DraggableGroupItem