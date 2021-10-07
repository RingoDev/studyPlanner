import {
    ADD_SEMESTER,
    CHECK_COURSE_CONSTRAINTS,
    HIDE_CONSTRAINT_INDICATORS, LOCK_DROPPABLES,
    MOVE_COURSE,
    MOVE_COURSE_IN_LIST,
    REMOVE_SEMESTER,
    SET_CUSTOM_STUDIES,
    SET_START_SEMESTER,
    SHOW_CONSTRAINT_INDICATORS, UNLOCK_DROPPABLES
} from "./data.types";
import {createAction} from "@reduxjs/toolkit"

export const moveCourse = createAction<{ sourceId: string, destinationId: string, courseId: string, sourceIndex: number, destinationIndex: number }>(MOVE_COURSE);
export const moveCourseInList = createAction<{ listId: string, courseId: string, sourceIndex: number, destinationIndex: number }>(MOVE_COURSE_IN_LIST);

export const addSemester = createAction<{}>(ADD_SEMESTER);
export const removeSemester = createAction<{ semesterIndex: number }>(REMOVE_SEMESTER)

export const showConstraintIndicators = createAction<{ sourceId: string, courseId: string, sourceIndex: number }>(SHOW_CONSTRAINT_INDICATORS)
export const hideConstraintIndicators = createAction<{}>(HIDE_CONSTRAINT_INDICATORS)

export const lockDroppables = createAction<{sourceId: string, draggableId: string }>(LOCK_DROPPABLES)
export const unlockDroppables = createAction<{ }>(UNLOCK_DROPPABLES)

export const setCustomStudies = createAction<{ semesterIndex: number, ects: number }>(SET_CUSTOM_STUDIES)
export const checkCourseConstraints = createAction<{}>(CHECK_COURSE_CONSTRAINTS)
export const setStartSemester = createAction<{ startSemesterIndex: number }>(SET_START_SEMESTER)


