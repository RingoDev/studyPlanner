import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Course from "../../types/types";
import ConstraintWarning from "./curriculum/constraint-warning";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import MarkedSearchText from "./marked-search-text";
import { useAppSelector } from "../../redux/hooks";
import { getCourseDisplayTitle } from "../../lib/general";

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
          <MarkedSearchText
            searchText={searchText}
            text={getCourseDisplayTitle(course)}
          />
        </ListItemText>
        {isInStorage ? null : <ConstraintWarning course={course} />}
      </StyledListItem>
    </Box>
  );
};
export default CourseItem;
