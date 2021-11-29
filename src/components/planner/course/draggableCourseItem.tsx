import Course from "../../../types/types";
import CourseItem from "./courseItem";
import {Draggable, DraggableStateSnapshot} from "react-beautiful-dnd";
import {CSSProperties} from "react";
import {isStorageId} from "../../../redux/data/data.reducer";

interface Props {
    course: Course
    index: number
    containerId: string
}


const DraggableCourseItem = ({course, containerId, index}: Props) => {

    const getStyle = (style: CSSProperties | undefined, snapshot: DraggableStateSnapshot): CSSProperties => {
        if (!snapshot.isDropAnimating || !snapshot.dropAnimation || !isStorageId(snapshot.draggingOver)) {
            return style ?? {};
        }
        const {curve, moveTo} = snapshot.dropAnimation;
        // move to the right spot
        const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
        // patching the existing style
        return {
            ...style,
            opacity: "0",
            transform: `${translate} scale(0.5)`,
            // slowing down the drop because we can
            transition: `all ${curve} 0.66s`,
        };
    }


    return (
        <Draggable draggableId={"c_" + course.id} index={index}>
            {(provided, snapshot) => {


                if (snapshot.isDragging) {
                    console.log(snapshot.draggingOver)
                }
                return (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                         style={getStyle(provided.draggableProps.style, snapshot)}
                    >
                        <CourseItem isInStorage={!containerId.startsWith("sem")} course={course}/>
                    </div>
                )
            }}
        </Draggable>
    )
}

export default DraggableCourseItem
