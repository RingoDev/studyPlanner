import { AnyAction, createReducer } from "@reduxjs/toolkit";
import { CurriculumType, Group } from "../../types/types";
import {
  addSemester,
  loadSavedCurriculum,
  moveCourse,
  moveGroup,
  removeSemester,
  resetCurriculum,
  setApplicationState,
  setCourseGrade,
  setCustomStudies,
  setExampleCurriculum,
  setSearchText,
  setStartSemester,
  setUploadedCurriculum,
} from "./data.actions";
import initialConfig, {
  getCoursesFromGroups,
  getGroupWithIdFromGroups,
} from "../../data";
import {
  moveCourseFromCurriculumToStorage,
  moveCourseFromGroupListToSemesterList,
} from "../../lib/moveCourses";
import {
  checkDependencyConstraints,
  checkSemesterConstraints,
  checkSteopConstraints,
  checkXOutOfYConstraints,
  getXOutOfYConstraint,
} from "../../lib/checkConstraints";
import {
  configGroupsToGroups,
  getGroupIdOfCourseId,
  isGroupId,
  isSemesterId,
  isStorageId,
  removeCoursesFromGroupList,
} from "../../lib/general";
import { set } from "idb-keyval";
import {
  createSaveObject,
  SavedCurriculum,
  setSavedCurriculum,
} from "../../lib/storeAndLoad";

export interface INITIAL_STATE_TYPE {
  initialConfig: typeof initialConfig;
  selectSemesterList: string[];
  startSemester: "WS" | "SS";
  startSemesterIndex: number;
  currentSemesterIndex: number;
  storage: Group[];
  curriculum: CurriculumType;
  lastChosenExample: number;
  searchText: string;
}

const yearOffset = 4;
const monthOffset = yearOffset * 2;
export const startYear = new Date().getFullYear() - yearOffset;
const selectOptions = monthOffset + 12;
const selectSemesterList: string[] = Array.from(
  Array(selectOptions).keys()
).map((n) =>
  n % 2 === 0
    ? `WS${startYear + n / 2}/${startYear - 1999 + n / 2}`
    : `SS${startYear + 1 + Math.floor(n / 2)}`
);

export function getSemesterName(index: number, startSemesterIndex: number) {
  const n = index + startSemesterIndex;
  if (n % 2 === 0) return `WS${startYear + n / 2}`;
  else return `SS${startYear + 1 + Math.floor(n / 2)}`;
}

const getCurrentSemester = () => {
  if (new Date().getMonth() < 4) {
    return monthOffset - 1;
  } else if (new Date().getMonth() < 10) {
    return monthOffset;
  }
  return monthOffset + 1;
};

const initialState: INITIAL_STATE_TYPE = {
  initialConfig: initialConfig,
  selectSemesterList: selectSemesterList,
  startSemester: "WS",
  startSemesterIndex: monthOffset,
  currentSemesterIndex: getCurrentSemester(),
  storage: configGroupsToGroups(initialConfig.groups),
  curriculum: {
    semesters: [],
  },
  lastChosenExample: -1,
  searchText: "",
};
// checking Course Constraints after most actions
const checkCourseConstraintsMatcher = (action: AnyAction) =>
  !setCustomStudies.match(action);

const saveCurriculumMatcher = (action: AnyAction) =>
  setCourseGrade.match(action) ||
  moveCourse.match(action) ||
  moveGroup.match(action) ||
  removeSemester.match(action) ||
  setCustomStudies.match(action) ||
  resetCurriculum.match(action);

const courseReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setExampleCurriculum, (state, { payload }) => {
      state.lastChosenExample = payload.exampleIndex;

      if (payload.exampleIndex < 0) {
        // remove whole curriculum and put all into storage
        // todo load saved custom configuration
        state.storage = configGroupsToGroups(state.initialConfig.groups);
        state.curriculum.semesters = [];
        return;
      }

      // set start semester to correct semester type
      if (
        state.startSemester !==
        state.initialConfig.examples[payload.exampleIndex].startsWith
      ) {
        if (state.startSemester === "WS") {
          // shift higher
          state.startSemesterIndex = state.startSemesterIndex + 1;
          state.startSemester = "SS";
        } else {
          // shift lower
          state.startSemesterIndex = state.startSemesterIndex - 1;
          state.startSemester = "WS";
        }
      }

      const transformedCurriculum: SavedCurriculum = {
        version: "0.0.2",
        semester: state.initialConfig.examples[
          payload.exampleIndex
        ].curriculum.map((s) => ({
          customEcts: s.customEcts,
          courses: s.courses.map((c) => ({
            id: c,
          })),
        })),
      };

      setSavedCurriculum(state, transformedCurriculum);
    })
    .addCase(moveCourse, (state, { payload }) => {
      // todo if a constraint is violated we should display a toast
      if (isGroupId(payload.sourceId) && isStorageId(payload.destinationId)) {
        // moving Course from storage to storage
        // do nothing
      } else if (
        isSemesterId(payload.sourceId) &&
        isSemesterId(payload.destinationId)
      ) {
        // moving between semesters

        // find semester
        const sourceSemesterIndex = Number(payload.sourceId.slice(3));
        const destinationSemesterIndex = Number(payload.destinationId.slice(3));
        const sourceCourseIndex = state.curriculum.semesters[
          sourceSemesterIndex
        ].courses.findIndex((c) => c.id === payload.courseId);
        // const destinationCourseIndex = state.curriculum.semesters[destinationSemesterIndex].courses.findIndex(c => c.id === payload.courseId)

        // remove course from semester list
        const course = state.curriculum.semesters[
          sourceSemesterIndex
        ].courses.splice(sourceCourseIndex, 1)[0];

        // add course to semester
        state.curriculum.semesters[destinationSemesterIndex].courses.splice(
          payload.destinationIndex,
          0,
          course
        );
      } else if (
        isGroupId(payload.sourceId) &&
        isSemesterId(payload.destinationId)
      ) {
        moveCourseFromGroupListToSemesterList(
          state.curriculum.semesters,
          state.storage,
          payload.sourceId,
          payload.courseId,
          Number(payload.destinationId.slice(3)),
          payload.destinationIndex
        );
      } else if (isStorageId(payload.destinationId)) {
        moveCourseFromCurriculumToStorage(
          state.curriculum,
          state.storage,
          getGroupIdOfCourseId(payload.courseId),
          payload.courseId,
          Number(payload.sourceId.slice(3))
        );
      }
      console.debug(
        `Successfully moved curse with id ${payload.courseId} from list ${payload.sourceId} to ${payload.destinationId}`
      );
    })
    .addCase(moveGroup, (state, { payload }) => {
      if (isStorageId(payload.destinationId)) return;
      // find semester
      const semesterIndex = Number(payload.destinationId.slice(3));
      const group = getGroupWithIdFromGroups(state.storage, payload.groupId);
      if (group === undefined) return;

      // if x out of y constraint exists on group or top group, only move as many courses to fulfill ects constraint
      const constraint = getXOutOfYConstraint(
        payload.groupId,
        state.initialConfig.constraints.xOutOfYConstraints
      );

      const courses = getCoursesFromGroups([group]);

      if (constraint === undefined) {
        for (let id of courses.map((c) => c.id)) {
          moveCourseFromGroupListToSemesterList(
            state.curriculum.semesters,
            state.storage,
            getGroupIdOfCourseId(id),
            id,
            semesterIndex,
            payload.destinationIndex
          );
        }
        return;
      }

      // we found a xOutOfYConstraint

      // move only courses to the curriculum until constraint is at its limit or violated

      // todo if no course was moved we should display a toast why no course ws moved
      const currentlyBookedEctsForGroup = state.curriculum.semesters
        .flatMap((s) => s.courses)
        .filter((c) => c.id.startsWith(constraint.group))
        .map((c) => c.ects)
        .reduce((e1, e2) => e1 + e2, 0);
      const maxEcts = constraint.maxEcts;
      for (
        let i = 0, addedCoursesEcts = currentlyBookedEctsForGroup;
        i < courses.length && addedCoursesEcts < maxEcts;
        i++, addedCoursesEcts += courses[i].ects
      ) {
        moveCourseFromGroupListToSemesterList(
          state.curriculum.semesters,
          state.storage,
          getGroupIdOfCourseId(courses[i].id),
          courses[i].id,
          semesterIndex,
          payload.destinationIndex
        );
      }
    })
    .addCase(addSemester, (state) => {
      state.curriculum.semesters.push({
        name: getSemesterName(
          state.curriculum.semesters.length,
          state.startSemesterIndex
        ),
        courses: [],
        customEcts: 0,
      });
    })

    .addCase(setSearchText, (state, { payload }) => {
      state.searchText = payload.text.trim();
    })

    .addCase(removeSemester, (state, { payload }) => {
      for (let id of state.curriculum.semesters[
        payload.semesterIndex
      ].courses.map((c) => c.id)) {
        moveCourseFromCurriculumToStorage(
          state.curriculum,
          state.storage,
          getGroupIdOfCourseId(id),
          id,
          payload.semesterIndex
        );
      }
      state.curriculum.semesters.splice(payload.semesterIndex, 1);

      // reset semester names
      for (let i = 0; i < state.curriculum.semesters.length; i++) {
        state.curriculum.semesters[i].name = getSemesterName(
          i,
          state.startSemesterIndex
        );
      }
    })
    .addCase(setStartSemester, (state, { payload }) => {
      state.startSemesterIndex = payload.startSemesterIndex;
      state.startSemester = payload.startSemesterIndex % 2 === 0 ? "WS" : "SS";

      for (let i = 0; i < state.curriculum.semesters.length; i++) {
        state.curriculum.semesters[i].name = getSemesterName(
          i,
          payload.startSemesterIndex
        );
      }
    })

    .addCase(setCustomStudies, (state, { payload }) => {
      state.curriculum.semesters[payload.semesterIndex].customEcts =
        payload.ects;
    })

    .addCase(setCourseGrade, (state, { payload }) => {
      for (let semester of state.curriculum.semesters) {
        for (let course of semester.courses) {
          if (course.id === payload.courseId) {
            course.grade = payload.grade;
            return;
          }
        }
      }
    })
    .addCase(setApplicationState, (state, { payload }) => {
      state.storage = removeCoursesFromGroupList(
        configGroupsToGroups(state.initialConfig.groups),
        payload.curriculum.semesters.flatMap((s) => s.courses).map((c) => c.id)
      );
      state.curriculum = payload.curriculum;
    })
    .addCase(setUploadedCurriculum, (state, { payload }) => {
      setSavedCurriculum(state, payload.curriculum);
    })
    .addCase(loadSavedCurriculum.fulfilled, (state, { payload }) => {
      setSavedCurriculum(state, payload);
    })
    .addCase(resetCurriculum, (state) => {
      state.storage = configGroupsToGroups(state.initialConfig.groups);
      state.curriculum.semesters = [];
    })
    .addMatcher(
      () => true,
      (state, action) => {
        console.log(action);
      }
    )
    .addMatcher(saveCurriculumMatcher, (state, { payload }) => {
      const stringToSave = createSaveObject(state.curriculum);

      set("curriculum", stringToSave).catch((err) =>
        console.error("Saving to IndexedDB storage failed", err)
      );
    })
    .addMatcher(checkCourseConstraintsMatcher, (state, { payload }) => {
      for (let i = 0; i < state.curriculum.semesters.length; i++) {
        for (let course of state.curriculum.semesters[i].courses) {
          course.violations = [];
          checkSemesterConstraints(state, course, i);
          checkSteopConstraints(state, course, i);
          checkDependencyConstraints(state, course, i);
        }
      }
      checkXOutOfYConstraints(state);
    });
});

export default courseReducer;
