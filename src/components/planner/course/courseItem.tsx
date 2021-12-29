import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import KusssLink from "./kusssLink";
import Course from "../../../types/types";
import ConstraintIndicator from "./constraintIndicator";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import HighlightSearchText from "../HighlightSearch";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  course: Course;
  isInStorage: boolean;
}

const CourseItem = ({ course, isInStorage }: Props) => {
  const searchText = useAppSelector((state) => state.data.searchText);
  const StyledListItem = styled(ListItem)(() => ({
    // backgroundColor: course.grade ? Color(course.color).alpha(0.3).string() : course.color,
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
        {isInStorage ? null : <ConstraintIndicator course={course} />}
      </StyledListItem>
    </Box>
  );
};
export default CourseItem;
