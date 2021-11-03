import {
    ADD_SEMESTER,
    CHECK_COURSE_CONSTRAINTS,
    HIDE_CONSTRAINT_INDICATORS,
    LOCK_DROPPABLES,
    MOVE_COURSE,
    MOVE_GROUP,
    REMOVE_SEMESTER,
    SET_APPLICATION_STATE,
    SET_COURSE_CREDITED,
    SET_COURSE_FINISHED,
    SET_COURSE_UNCREDITED,
    SET_COURSE_UNFINISHED,
    SET_CUSTOM_STUDIES, SET_EXAMPLE_CURRICULUM,
    SET_START_SEMESTER,
    SHOW_CONSTRAINT_INDICATORS,
    UNLOCK_DROPPABLES
} from "./data.types";
import {createAction} from "@reduxjs/toolkit"
import initialConfig from "../../data";
import {CurriculumType} from "../../types/types";

export const moveCourse = createAction<{ sourceId: string, destinationId: string, courseId: string }>(MOVE_COURSE);
export const moveGroup = createAction<{ destinationId: string, groupId: string }>(MOVE_GROUP);
// export const moveCourseInList = createAction<{ listId: string, courseId: string, sourceIndex: number, destinationIndex: number }>(MOVE_COURSE_IN_LIST);

export const addSemester = createAction<{}>(ADD_SEMESTER);
export const removeSemester = createAction<{ semesterIndex: number }>(REMOVE_SEMESTER)

export const showConstraintIndicators = createAction<{ sourceId: string, courseId: string, sourceIndex: number }>(SHOW_CONSTRAINT_INDICATORS)
export const hideConstraintIndicators = createAction<{}>(HIDE_CONSTRAINT_INDICATORS)

export const lockDroppables = createAction<{ sourceId: string, draggableId: string }>(LOCK_DROPPABLES)
export const unlockDroppables = createAction<{}>(UNLOCK_DROPPABLES)

export const setCustomStudies = createAction<{ semesterIndex: number, ects: number }>(SET_CUSTOM_STUDIES)
export const checkCourseConstraints = createAction<{}>(CHECK_COURSE_CONSTRAINTS)
export const setStartSemester = createAction<{ startSemesterIndex: number }>(SET_START_SEMESTER)

export const setCourseFinished = createAction<{ courseId: string }>(SET_COURSE_FINISHED)
export const setCourseUnfinished = createAction<{ courseId: string }>(SET_COURSE_UNFINISHED)

export const setCourseCredited = createAction<{ courseId: string }>(SET_COURSE_CREDITED)
export const setCourseUncredited = createAction<{ courseId: string }>(SET_COURSE_UNCREDITED)
export const setExampleCurriculum = createAction<{ exampleIndex: number }>(SET_EXAMPLE_CURRICULUM)

export const setApplicationState = createAction<{ config: typeof initialConfig, curriculum: CurriculumType }>(SET_APPLICATION_STATE)

