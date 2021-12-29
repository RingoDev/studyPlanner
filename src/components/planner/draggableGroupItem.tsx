import { Group } from "../../types/types";
import { COURSE_GROUP } from "../../types/dndTypes";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";
import { CSSProperties } from "react";
import { isStorageId } from "../../lib/general";
import GroupItem from "./groupItem";

interface Props {
  group: Group;
  index: number;
  containerId: string;
  level: number;
}

const DraggableGroupItem = ({ group, index, level }: Props) => {
  if (group.type === COURSE_GROUP && group.courses.length === 0) {
    return <></>;
  }

  const getStyle = (
    style: CSSProperties | undefined,
    snapshot: DraggableStateSnapshot
  ): CSSProperties => {
    if (
      !snapshot.isDropAnimating ||
      !snapshot.dropAnimation ||
      !isStorageId(snapshot.draggingOver)
    ) {
      return style ?? {};
    }
    const { curve, moveTo } = snapshot.dropAnimation;
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
  };

  return (
    <Draggable draggableId={"g_" + group.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getStyle(provided.draggableProps.style, snapshot)}
          >
            <GroupItem level={level} group={group} index={index} />
          </div>
        );
      }}
    </Draggable>
  );
};

export default DraggableGroupItem;
