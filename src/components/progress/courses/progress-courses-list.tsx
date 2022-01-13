import React from "react";
import List from "@mui/material/List";
import { Box } from "@mui/material";
import ProgressCourseItem from "./progress-course-item";
import { useAppSelector } from "../../../redux/hooks";
import { courseMatchesSearch } from "../../../lib/search";

interface Props {
  semesterIndex?: number;
}

const ProgressCoursesList = ({ semesterIndex }: Props) => {
  const courses = useAppSelector((state) =>
    semesterIndex === undefined
      ? state.data.curriculum.semesters.flatMap((s) => s.courses)
      : state.data.curriculum.semesters[semesterIndex].courses
  );
  const searchText = useAppSelector((state) => state.data.searchText);

  return (
    <Box>
      <List disablePadding sx={{ paddingTop: "0.5rem" }}>
        {courses.map((c) => {
            if (courseMatchesSearch(c, searchText)) {
              return <ProgressCourseItem key={c.id} course={c} />;
            }
            return null;
          }
        )}
      </List>
    </Box>
  );
};

export default ProgressCoursesList;
