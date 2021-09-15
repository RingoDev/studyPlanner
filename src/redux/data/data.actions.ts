import {
    ADD_SEMESTER, HIDE_CONSTRAINT_INDICATORS,
    MOVE_COURSE,
    MOVE_COURSE_IN_LIST,
    REMOVE_SEMESTER,
    SET_START_SEMESTER, SHOW_CONSTRAINT_INDICATORS,
} from "./data.types";
import {createAction} from "@reduxjs/toolkit"

export const moveCourse = createAction<{ sourceId: string, destinationId: string, courseId: string, sourceIndex:number,destinationIndex: number }>(MOVE_COURSE);
export const moveCourseInList = createAction<{ listId: string, courseId: string, sourceIndex: number, destinationIndex: number }>(MOVE_COURSE_IN_LIST);

export const addSemester = createAction<{}>(ADD_SEMESTER);
export const removeSemester = createAction<{semesterIndex:number}>(REMOVE_SEMESTER)

export const showConstraintIndicators = createAction<{sourceId: string, courseId: string, sourceIndex:number}>(SHOW_CONSTRAINT_INDICATORS)
export const hideConstraintIndicators = createAction<{}>(HIDE_CONSTRAINT_INDICATORS)

export const setStartSemester = createAction<{startSemester:"WS"|"SS"}>(SET_START_SEMESTER)


