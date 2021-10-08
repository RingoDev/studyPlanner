import {Group} from "../types/types";
import {useDrag} from "react-dnd";
import {GROUP, STORAGE} from "../types/dndTypes";
import GroupItem from "./groupItem";
import {MultipleCourseDrop} from "./droppableCourseList";

interface Props {
    group: Group
    index: number
}


const DraggableGroupItem = ({group, index}: Props) => {
    const [collected, drag,] = useDrag<MultipleCourseDrop, any, { isDragging: boolean }>(() => {
        console.log(index,group)

        return {
            type: GROUP,
            item: {type: GROUP, payload: {id:group.id}, sourceId: STORAGE},
        }
    })


    if (group.courses.length === 0) {
        return <></>
    }
    return (
        <div ref={drag} {...collected} style={{cursor: "pointer"}}>
            <GroupItem group={group} index={index}/>
        </div>
    )
}

export default DraggableGroupItem