import React from "react";
import List from "@mui/material/List";
import { Box } from "@mui/material";
import ProgressCourseItem from "./progress-course-item";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  semesterIndex?: number;
}

const ProgressCoursesList = ({ semesterIndex }: Props) => {
  const courses = useAppSelector((state) =>
    semesterIndex === undefined
      ? state.data.curriculum.semesters.flatMap((s) => s.courses)
      : state.data.curriculum.semesters[semesterIndex].courses
  );

  return (
    <Box>
      <List disablePadding sx={{ paddingTop: "0.5rem" }}>
        {courses.map((c) => (
          <ProgressCourseItem key={c.id} course={c} />
        ))}
        {/*<ProgressCustomStudies semesterIndex={index} />*/}
      </List>
    </Box>
  );
};

export default ProgressCoursesList;
