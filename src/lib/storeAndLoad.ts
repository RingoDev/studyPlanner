import { CurriculumType, Grade } from "../types/types";
import { configGroupsToGroups, getGroupIdOfCourseId } from "./general";
import { moveCourseFromGroupListToSemesterList } from "./moveCourses";
import {
  getSemesterName,
  INITIAL_STATE_TYPE,
} from "../redux/data/data.reducer";

export interface SavedCurriculum {
  version: string;
  semester: {
    customEcts: number;
    courses: {
      id: string;
      grade?: Grade;
    }[];
  }[];
}

export function createSaveObject(
  curriculum: CurriculumType,
  version: string = "0.0.1"
): string {
  const toSave: SavedCurriculum = {
    version: version,
    semester: curriculum.semesters.map((s) => ({
      customEcts: s.customEcts,
      courses: s.courses.map((c) => ({ id: c.id, grade: c.grade })),
    })),
  };
  return JSON.stringify(toSave);
}

export function loadSaveObject(saved: string): SavedCurriculum {
  return JSON.parse(saved) as SavedCurriculum;
}

export function setSavedCurriculum(
  state: INITIAL_STATE_TYPE,
  curriculum: SavedCurriculum
) {
  // reset storage and curriculum
  state.storage = configGroupsToGroups(state.initialConfig.groups);
  state.curriculum.semesters = [];

  // move all the specified courses from storage to curriculum
  for (let i = 0; i < curriculum.semester.length; i++) {
    state.curriculum.semesters.push({
      name: getSemesterName(i, state.startSemesterIndex),
      courses: [],
      customEcts: curriculum.semester[i].customEcts,
    });
    loop: for (let j = 0; j < curriculum.semester[i].courses.length; j++) {
      // move course from storage to curriculum
      const courseId = curriculum.semester[i].courses[j].id;

      moveCourseFromGroupListToSemesterList(
        state.curriculum.semesters,
        state.storage,
        getGroupIdOfCourseId(courseId),
        courseId,
        i,
        j
      );
      // set grade
      for (let semester of state.curriculum.semesters) {
        for (let course of semester.courses) {
          if (course.id === courseId) {
            course.grade = curriculum.semester[i].courses[j].grade;
            continue loop;
          }
        }
      }
    }
  }
}
