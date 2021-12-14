import {
  ADD_SEMESTER,
  CHECK_COURSE_CONSTRAINTS,
  HIDE_CONSTRAINT_INDICATORS,
  MOVE_COURSE,
  MOVE_GROUP,
  REMOVE_SEMESTER,
  SET_APPLICATION_STATE,
  SET_COURSE_FINISHED,
  SET_COURSE_GRADE,
  SET_COURSE_UNFINISHED,
  SET_CUSTOM_STUDIES,
  SET_EXAMPLE_CURRICULUM,
  SET_START_SEMESTER,
  SHOW_CONSTRAINT_INDICATORS,
} from "./data.types";
import { createAction } from "@reduxjs/toolkit";
import initialConfig from "../../data";
import { CurriculumType } from "../../types/types";

export const moveCourse =
  createAction<{
    sourceId: string;
    destinationId: string;
    courseId: string;
    destinationIndex: number;
  }>(MOVE_COURSE);
export const moveGroup =
  createAction<{
    destinationId: string;
    groupId: string;
    destinationIndex: number;
  }>(MOVE_GROUP);

export const addSemester = createAction<{}>(ADD_SEMESTER);
export const removeSemester =
  createAction<{ semesterIndex: number }>(REMOVE_SEMESTER);

export const showConstraintIndicators = createAction<{
  sourceId: string;
  courseId: string;
  sourceIndex: number;
}>(SHOW_CONSTRAINT_INDICATORS);
export const hideConstraintIndicators = createAction<{}>(
  HIDE_CONSTRAINT_INDICATORS
);

export const setCustomStudies =
  createAction<{ semesterIndex: number; ects: number }>(SET_CUSTOM_STUDIES);
export const checkCourseConstraints = createAction<{}>(
  CHECK_COURSE_CONSTRAINTS
);
export const setStartSemester =
  createAction<{ startSemesterIndex: number }>(SET_START_SEMESTER);

export const setCourseFinished =
  createAction<{ courseId: string }>(SET_COURSE_FINISHED);
export const setCourseUnfinished = createAction<{ courseId: string }>(
  SET_COURSE_UNFINISHED
);
export const setCourseGrade =
  createAction<{ courseId: string; grade: 0 | 1 | 2 | 3 | 4 }>(
    SET_COURSE_GRADE
  );

export const setExampleCurriculum = createAction<{ exampleIndex: number }>(
  SET_EXAMPLE_CURRICULUM
);

export const setApplicationState = createAction<{
  config: typeof initialConfig;
  curriculum: CurriculumType;
}>(SET_APPLICATION_STATE);
