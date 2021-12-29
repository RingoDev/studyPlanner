import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Course from "../../types/types";
import { useAppSelector } from "../../redux/hooks";
import KusssLink from "../planner/course/kusssLink";
import HighlightSearchText from "../planner/HighlightSearch";
import CourseStateOption from "../planner/course/courseStateOption";

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
              <HighlightSearchText
                searchText={searchText}
                text={course.sign + " - " + course.title}
              />
            </KusssLink>
          ) : (
            course.sign + " - " + course.title
          )}
        </ListItemText>
        <CourseStateOption course={course} />
      </StyledListItem>
    </Box>
  );
};
export default ProgressCourseItem;
