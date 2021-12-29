import React from "react";
import List from "@mui/material/List";
import { Box } from "@mui/material";
import ProgressCourseItem from "./progressCourseItem";
import { useAppSelector } from "../../redux/hooks";

interface Props {
  semesterIndex?: number;
}

const CourseList = ({ semesterIndex }: Props) => {
  const courses = useAppSelector((state) =>
    semesterIndex === undefined
      ? state.data.curriculum.semesters.flatMap((s) => s.courses)
      : state.data.curriculum.semesters[semesterIndex].courses
  );

  return (
    <Box sx={{ border: "2px solid #cccccc" }}>
      <List disablePadding sx={{ paddingTop: "0.5rem" }}>
        {courses.map((c) => (
          <ProgressCourseItem key={c.id} course={c} />
        ))}
        {/*<ProgressCustomStudies semesterIndex={index} />*/}
      </List>
    </Box>
  );
};

export default CourseList;
