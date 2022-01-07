import { Droppable } from "react-beautiful-dnd";
import List from "@mui/material/List";
import { COURSE_GROUP } from "../../../types/dndTypes";
import CourseItemDraggable from "../course-item-draggable";
import GroupItemDraggable from "./group-item-draggable";
import React from "react";
import { Group } from "../../../types/types";
import { styled } from "@mui/material/styles";

interface Props {
  group: Group;
  level: number;
  fullyBooked: boolean;
}

const CollapsedContainer = styled("div")(() => ({
  height: "100%",
}));

const GroupListCollapsable = ({ group, level, fullyBooked }: Props) => (
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
                  <CourseItemDraggable
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
                  <GroupItemDraggable
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

export default GroupListCollapsable;
