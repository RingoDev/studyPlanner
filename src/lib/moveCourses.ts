import Course, { CurriculumType, Group, SemesterType } from "../types/types";
import { COMPOSITE_GROUP, COURSE_GROUP } from "../types/dndTypes";

export function moveCourseFromGroupListToSemesterList(
  semesters: SemesterType[],
  groups: Group[],
  groupId: string,
  courseId: string,
  semesterIndex: number,
  destinationIndex: number
) {
  for (let group of groups) {
    if (group.id === groupId && group.type === COURSE_GROUP) {
      const courseIndex = group.courses.findIndex((c) => c.id === courseId);
      if (courseIndex === -1) {
        console.error(
          `Couldn't find course with id ${courseId} ` +
            `in group ${groupId} in the given semester list`
        );
        return;
      }
      // remove course from Storage
      const course = group.courses.splice(courseIndex, 1)[0];

      // add course to semester
      semesters[semesterIndex].courses.splice(destinationIndex, 0, course);
      return;
    } else if (groupId.startsWith(group.id) && group.type === COMPOSITE_GROUP) {
      // we must go deeper
      moveCourseFromGroupListToSemesterList(
        semesters,
        group.groups,
        groupId,
        courseId,
        semesterIndex,
        destinationIndex
      );
    }
  }
}

export function moveCourseFromCurriculumToStorage(
  curriculum: CurriculumType,
  groups: Group[],
  groupId: string,
  courseId: string,
  semesterIndex: number
) {
  for (let group of groups) {
    if (group.id === groupId && group.type === COURSE_GROUP) {
      const courseIndex = curriculum.semesters[semesterIndex].courses.findIndex(
        (c) => c.id === courseId
      );
      if (courseIndex !== -1) {
        // remove course from semester list set finished attribute false
        const course: Course = {
          ...curriculum.semesters[semesterIndex].courses.splice(
            courseIndex,
            1
          )[0],
          violations: [],
        };

        // add course to storage
        group.courses.splice(0, 0, course);
      }
      return;
    } else if (groupId.startsWith(group.id) && group.type === COMPOSITE_GROUP) {
      // we must go deeper
      moveCourseFromCurriculumToStorage(
        curriculum,
        group.groups,
        groupId,
        courseId,
        semesterIndex
      );
    }
  }
}
