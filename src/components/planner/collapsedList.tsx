import { Droppable } from "react-beautiful-dnd";
import List from "@mui/material/List";
import { COURSE_GROUP } from "../../types/dndTypes";
import DraggableCourseItem from "./course/draggableCourseItem";
import DraggableGroupItem from "./draggableGroupItem";
import React from "react";
import { Group } from "../../types/types";
import { styled } from "@mui/material/styles";

interface Props {
  group: Group;
  level: number;
  fullyBooked: boolean;
}

const CollapsedContainer = styled("div")(() => ({
  height: "100%",
}));

const CollapsedList = ({ group, level, fullyBooked }: Props) => (
  <CollapsedContainer
    sx={{
      paddingLeft: String(Math.round((level + 1) * 0.5 * 10) / 10) + "rem",
    }}
  >
    <Droppable droppableId={group.id} isDropDisabled>
      {(provided) => (
        <List
          component="div"
          disablePadding
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {group.type === COURSE_GROUP
            ? group.courses.map((course, cIndex) => (
                <div key={course.id}>
                  <DraggableCourseItem
                    course={{
                      ...course,
                      color: fullyBooked ? "#cccccc" : group.color,
                    }}
                    index={cIndex}
                    containerId={group.id}
                  />
                </div>
              ))
            : group.groups.map((group, cIndex) => (
                <div key={group.id}>
                  <DraggableGroupItem
                    level={level + 1}
                    group={{
                      ...group,
                      color: fullyBooked ? "#cccccc" : group.color,
                    }}
                    index={cIndex}
                    containerId={group.id}
                  />
                </div>
              ))}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </CollapsedContainer>
);

export default CollapsedList;
