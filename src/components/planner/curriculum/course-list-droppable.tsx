import React from "react";
import { SemesterType } from "../../../types/types";
import { Droppable } from "react-beautiful-dnd";
import List from "@mui/material/List";
import CourseItemDraggable from "../course-item-draggable";
import CustomStudies from "./custom-studies";
import { Box } from "@mui/material";
import { courseMatchesSearch } from "../../../lib/search";
import { useAppSelector } from "../../../lib/hooks/redux-hooks";

interface Props {
  semester: SemesterType;
  index: number;
}

const CourseListDroppable = ({ semester, index }: Props) => {
  const searchText = useAppSelector((state) => state.data.searchText);

  return (
    <Droppable droppableId={"sem" + index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          sx={{ border: "2px solid #cccccc", height: "100%" }}
          {...provided.droppableProps}
        >
          <List disablePadding sx={{ paddingTop: "0.5rem" }}>
            {semester.courses.map((c, index) => {
              if (courseMatchesSearch(c, searchText)) {
                return (
                  <CourseItemDraggable
                    key={c.id}
                    course={c}
                    index={index}
                    containerId={"sem" + index}
                  />
                );
              }
              return null;
            })}
            {provided.placeholder}
            <CustomStudies semesterIndex={index} />
          </List>
        </Box>
      )}
    </Droppable>
  );
};

export default CourseListDroppable;
