import Course from "../../../types/types";
import CourseItem from "./courseItem";
import {Draggable, DraggableStateSnapshot} from "react-beautiful-dnd";
import React, {CSSProperties} from "react";
import {isStorageId} from "../../../redux/data/data.reducer";

interface Props {
    course: Course
    index: number
    containerId: string
}

const DraggableCourseItem: React.FC<Props> = ({course, containerId, index}) => {

    const getStyle = (style: CSSProperties | undefined, snapshot: DraggableStateSnapshot): CSSProperties => {
        if (!snapshot.isDropAnimating || !snapshot.dropAnimation || !isStorageId(snapshot.draggingOver)) {
            return style ?? {};
        }
        const {curve, moveTo} = snapshot.dropAnimation;
        // patching the existing style
        return {
            ...style,
            opacity: "0",
            transform: `translate(${moveTo.x}px, ${moveTo.y}px) scale(0.5)`,
            // slowing down the drop because I can
            transition: `all ${curve} 0.66s`,
        };
    }

    return (
        <Draggable draggableId={"c_" + course.id} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                     style={getStyle(provided.draggableProps.style, snapshot)}>
                    <CourseItem isInStorage={!containerId.startsWith("sem")} course={course}/>
                </div>
            )}
        </Draggable>
    )
}

export default DraggableCourseItem
