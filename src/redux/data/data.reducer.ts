import { AnyAction, createReducer } from "@reduxjs/toolkit";
import { CurriculumType, Group, SemesterInfo } from "../../types/types";
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
  checkCombinedCoursesConstraints,
  checkDependencyConstraints,
  checkSemesterConstraints,
  checkSteopConstraints,
  checkXOutOfYConstraints,
  getXOutOfYConstraint,
} from "../../lib/checkConstraints";
import {
  getGroupIdOfCourseId,
  isGroupId,
  isSemesterId,
  isStorageId,
  removeCoursesFromGroupList,
} from "../../lib/general";
import { set } from "idb-keyval";
import {
  createSaveObject,
  SavedCurriculumV3,
  setSavedCurriculum,
} from "../../lib/storeAndLoad";

export interface INITIAL_STATE_TYPE {
  initialConfig: typeof initialConfig;
  dataLoaded: boolean;
  selectSemesterList: SemesterInfo[];
  startSemester: SemesterInfo;
  storage: Group[];
  curriculum: CurriculumType;
  lastChosenExample: number;
  searchText: string;
}

const getStartYear = () => {
  const yearOffset = 4;
  return new Date().getFullYear() - yearOffset;
};

const createSemesterList = () => {
  const selectOptions = 16;
  const startYear = getStartYear();

  return Array.from(Array(selectOptions).keys()).map((n, index) => {
    if (index % 2 === 0) {
      return { isWS: true, year: startYear + index / 2 };
    } else {
      return { isWS: false, year: startYear + Math.ceil(index / 2) };
    }
  });
};

export function getSemesterName(
  index: number,
  startSemesterInfo: SemesterInfo
) {
  if (index % 2 === 0) {
    if (startSemesterInfo.isWS) {
      return `WS${startSemesterInfo.year + index / 2}`;
    } else {
      return `SS${startSemesterInfo.year + index / 2}`;
    }
  } else {
    if (startSemesterInfo.isWS) {
      return `SS${startSemesterInfo.year + Math.ceil(index / 2)}`;
    } else {
      return `WS${startSemesterInfo.year + Math.floor(index / 2)}`;
    }
  }
}

const initialState: INITIAL_STATE_TYPE = {
  initialConfig: initialConfig,
  dataLoaded: false,
  selectSemesterList: createSemesterList(),
  startSemester: { isWS: true, year: getStartYear() },
  // todo check if this shallow copy makes problems or if we need a deep copy
  storage: initialConfig.storage.slice(),
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
        state.storage = state.initialConfig.storage;
        state.curriculum.semesters = [];
        return;
      }

      const transformedCurriculum: SavedCurriculumV3 = {
        version: "0.0.3",
        startSemester: {
          isWS: state.initialConfig.examples[payload.exampleIndex].startsWithWS,
          year: state.startSemester.year,
        },
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

        // check if something went wrong
        if (
          isNaN(sourceSemesterIndex) ||
          sourceSemesterIndex >= state.curriculum.semesters.length ||
          sourceSemesterIndex < 0
        )
          return;
        if (
          isNaN(destinationSemesterIndex) ||
          destinationSemesterIndex > state.curriculum.semesters.length ||
          destinationSemesterIndex < 0
        )
          return;

        if (destinationSemesterIndex === state.curriculum.semesters.length) {
          //  dragged onto addSemester button -> first we need to add a semester
          state.curriculum.semesters.push({
            name: getSemesterName(
              state.curriculum.semesters.length,
              state.startSemester
            ),
            courses: [],
            customEcts: 0,
          });
        }
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
        const destinationSemesterIndex = Number(payload.destinationId.slice(3));
        // check if something went wrong
        if (
          isNaN(destinationSemesterIndex) ||
          destinationSemesterIndex > state.curriculum.semesters.length ||
          destinationSemesterIndex < 0
        )
          return;

        if (destinationSemesterIndex === state.curriculum.semesters.length) {
          //  dragged onto addSemester button -> first we need to add a semester
          state.curriculum.semesters.push({
            name: getSemesterName(
              state.curriculum.semesters.length,
              state.startSemester
            ),
            courses: [],
            customEcts: 0,
          });
        }

        moveCourseFromGroupListToSemesterList(
          state.curriculum.semesters,
          state.storage,
          payload.sourceId,
          payload.courseId,
          destinationSemesterIndex,
          payload.destinationIndex
        );
      } else if (isStorageId(payload.destinationId)) {
        const sourceSemesterIndex = Number(payload.sourceId.slice(3));
        // check if something went wrong
        if (
          isNaN(sourceSemesterIndex) ||
          sourceSemesterIndex >= state.curriculum.semesters.length ||
          sourceSemesterIndex < 0
        )
          return;
        moveCourseFromCurriculumToStorage(
          state.curriculum,
          state.storage,
          getGroupIdOfCourseId(payload.courseId),
          payload.courseId,
          sourceSemesterIndex
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
      // check if something went wrong
      if (
        isNaN(semesterIndex) ||
        semesterIndex > state.curriculum.semesters.length ||
        semesterIndex < 0
      )
        return;

      if (semesterIndex === state.curriculum.semesters.length) {
        //  dragged onto addSemester button -> first we need to add a semester
        state.curriculum.semesters.push({
          name: getSemesterName(
            state.curriculum.semesters.length,
            state.startSemester
          ),
          courses: [],
          customEcts: 0,
        });
      }

      const group = getGroupWithIdFromGroups(state.storage, payload.groupId);
      if (group === undefined) return;

      // if x out of y constraint exists on group or top group, only move as many courses to fulfill ects constraint
      // todo display toast that there is a constraint on the group
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
          state.startSemester
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
          state.startSemester
        );
      }
    })
    .addCase(setStartSemester, (state, { payload }) => {
      state.startSemester = payload.startSemesterInfo;
      for (let i = 0; i < state.curriculum.semesters.length; i++) {
        state.curriculum.semesters[i].name = getSemesterName(
          i,
          payload.startSemesterInfo
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
        state.initialConfig.storage,
        payload.curriculum.semesters.flatMap((s) => s.courses).map((c) => c.id)
      );
      state.curriculum = payload.curriculum;
    })
    .addCase(setUploadedCurriculum, (state, { payload }) => {
      setSavedCurriculum(state, payload.curriculum);
    })
    .addCase(loadSavedCurriculum.fulfilled, (state, { payload }) => {
      setSavedCurriculum(state, payload);
      state.dataLoaded = true;
    })
    .addCase(loadSavedCurriculum.rejected, (state) => {
      state.dataLoaded = true;
    })
    .addCase(resetCurriculum, (state) => {
      state.storage = state.initialConfig.storage;
      state.curriculum.semesters = [];
    })
    .addMatcher(saveCurriculumMatcher, (state) => {
      const stringToSave = createSaveObject(
        state.curriculum,
        state.startSemester
      );

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
          checkCombinedCoursesConstraints(state, course, i);
        }
      }
      checkXOutOfYConstraints(state);
    });
});

export default courseReducer;
