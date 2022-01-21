import { CurriculumType, Grade, SemesterInfo } from "../types/types";
import { configGroupsToGroups, getGroupIdOfCourseId } from "./general";
import { moveCourseFromGroupListToSemesterList } from "./moveCourses";
import {
  getSemesterName,
  INITIAL_STATE_TYPE,
} from "../redux/data/data.reducer";

export interface SavedCurriculumV3 extends SavedCurriculum {
  version: "0.0.3";

  startSemester: SemesterInfo;
  semester: {
    customEcts: number;
    courses: {
      id: string;
      grade?: Grade;
    }[];
  }[];
}

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
  startSemester: SemesterInfo
): string {
  const toSave: SavedCurriculumV3 = {
    version: "0.0.3",
    startSemester: startSemester,
    semester: curriculum.semesters.map((s) => ({
      customEcts: s.customEcts,
      courses: s.courses.map((c) => ({ id: c.id, grade: c.grade })),
    })),
  };
  return JSON.stringify(toSave);
}

export function setSavedCurriculum(
  state: INITIAL_STATE_TYPE,
  curriculum: SavedCurriculumV3
) {
  // reset storage and curriculum
  state.storage = configGroupsToGroups(state.initialConfig.groups);
  state.curriculum.semesters = [];

  state.startSemester = curriculum.startSemester;

  // move all the specified courses from storage to curriculum
  for (let i = 0; i < curriculum.semester.length; i++) {
    state.curriculum.semesters.push({
      name: getSemesterName(i, state.startSemester),
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
