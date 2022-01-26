import {
  ADD_SEMESTER,
  CHECK_COURSE_CONSTRAINTS,
  LOAD_SAVED_CURRICULUM,
  MOVE_COURSE,
  MOVE_GROUP,
  REMOVE_SEMESTER,
  RESET_CURRICULUM,
  SET_APPLICATION_STATE,
  SET_COURSE_GRADE,
  SET_CUSTOM_STUDIES,
  SET_EXAMPLE_CURRICULUM,
  SET_SEARCH_TEXT,
  SET_START_SEMESTER,
  SET_UPLOADED_CURRICULUM,
} from "./data.types";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "idb-keyval";
import { SavedCurriculumV3 } from "../../lib/storeAndLoad";
import initialConfig from "../../data";
import { CurriculumType, SemesterInfo } from "../../types/types";

export const moveCourse = createAction<{
  sourceId: string;
  destinationId: string;
  courseId: string;
  destinationIndex: number;
}>(MOVE_COURSE);
export const moveGroup = createAction<{
  destinationId: string;
  groupId: string;
  destinationIndex: number;
}>(MOVE_GROUP);

export const addSemester = createAction<{}>(ADD_SEMESTER);
export const removeSemester =
  createAction<{ semesterIndex: number }>(REMOVE_SEMESTER);

export const resetCurriculum = createAction<{}>(RESET_CURRICULUM);

export const setCustomStudies =
  createAction<{ semesterIndex: number; ects: number }>(SET_CUSTOM_STUDIES);
export const setStartSemester =
  createAction<{ startSemesterInfo: SemesterInfo }>(SET_START_SEMESTER);

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

export const setUploadedCurriculum = createAction<{
  curriculum: SavedCurriculumV3;
}>(SET_UPLOADED_CURRICULUM);

export const setSearchText = createAction<{
  text: string;
}>(SET_SEARCH_TEXT);

export const loadSavedCurriculum = createAsyncThunk(
  LOAD_SAVED_CURRICULUM,
  async () => {
    return await new Promise<SavedCurriculumV3>((res, rej) => {
      get<string>("curriculum").then((c) =>
        c === undefined ? rej() : res(JSON.parse(c) as SavedCurriculumV3)
      );
    });
  }
);
