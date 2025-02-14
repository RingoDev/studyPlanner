import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useRef, useState } from "react";
import Course, { Grade } from "../../../types/types";
import { useAppDispatch } from "../../../redux/hooks";
import { setCourseGrade } from "../../../redux/data/data.actions";
import { styled } from "@mui/material/styles";

const CourseGradeCheckbox = ({ course }: { course: Course }) => {
  const GradeBox = styled("div")(({ theme }) => ({
    width: "24px",
    height: "24px",
    borderBottom: `1px solid ${theme.palette.secondary.dark}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.secondary.dark,
    fontSize: "1rem",
  }));

  const dispatch = useAppDispatch();
  const anchorRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const setGrade = (grade: Grade) => {
    dispatch(setCourseGrade({ courseId: course.id, grade: grade }));
    setOpen(false);
  };

  const grades: Grade[] = [0, 1, 2, 3, 4];

  return (
    <ListItemIcon>
      <Button ref={anchorRef} onClick={() => setOpen(true)}>
        <GradeBox>{course.grade === 0 ? null : course.grade}</GradeBox>
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: (course.grade ?? 0) * 32,
          horizontal: "center",
        }}
      >
        {grades.map((n) => {
          const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
            padding: "0",
            minHeight: "0",
            width: "32px",
            height: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              course.grade === n || (course.grade === undefined && n === 0)
                ? theme.palette.secondary.light
                : "none",
            ":hover": {
              backgroundColor:
                course.grade === n || (course.grade === undefined && n === 0)
                  ? theme.palette.secondary.main
                  : "rgba(0, 0, 0, 0.04)",
            },
          }));
          return (
            <StyledMenuItem key={n} onClick={() => setGrade(n)}>
              {n === 0 ? " " : n}
            </StyledMenuItem>
          );
        })}
      </Menu>
    </ListItemIcon>
  );
};

export default CourseGradeCheckbox;
