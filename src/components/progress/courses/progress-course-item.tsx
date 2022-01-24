import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Course from "../../../types/types";
import { useAppSelector } from "../../../lib/hooks/redux-hooks";
import KusssLink from "./kusss-link";
import MarkedSearchText from "../../planner/marked-search-text";
import CourseGradeCheckbox from "./course-grade-checkbox";
import { getCourseDisplayTitle } from "../../../lib/general";

interface Props {
  course: Course;
}

const ProgressCourseItem = ({ course }: Props) => {
  const searchText = useAppSelector((state) => state.data.searchText);
  const StyledListItem = styled(ListItem)(() => ({
    backgroundColor: course.color,
    padding: "0.5rem",
  }));

  return (
    <Box sx={{ padding: "0 0.5rem 0.375rem 0.5rem" }}>
      <StyledListItem>
        <ListItemText>
          {course.kusssId !== "" ? (
            <KusssLink id={course.kusssId}>
              <MarkedSearchText
                searchText={searchText}
                text={getCourseDisplayTitle(course)}
              />
            </KusssLink>
          ) : (
            getCourseDisplayTitle(course)
          )}
        </ListItemText>
        <CourseGradeCheckbox course={course} />
      </StyledListItem>
    </Box>
  );
};
export default ProgressCourseItem;
