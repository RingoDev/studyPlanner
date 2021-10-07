import {Group} from "../types/types";
import {useDrag} from "react-dnd";
import {GROUP} from "../types/dndTypes";
import GroupItem from "./groupItem";

interface Props {
    group: Group
    index: number
}


const DraggableGroupItem = ({group, index}: Props) => {
    const [collected, drag,] = useDrag<{ id: string }, any, { isDragging: boolean }>(() => ({
        type: GROUP,
        item: {id: group.id},
    }))

    if(group.courses.length === 0){
        return <></>
    }
    return (
        <div ref={drag} {...collected} style={{cursor: "pointer"}}>
            <GroupItem group={group} index={index}/>
        </div>
    )
}

export default DraggableGroupItem