import { getCoursesFromGroups, InitialGroupType } from "../data";
import Course, { Group } from "../types/types";
import {
  COMPOSITE_GROUP,
  COURSE_GROUP,
  PSEUDO_STORAGE,
  STORAGE,
} from "../types/dndTypes";

export function getCourseById(
  id: string,
  groups: InitialGroupType[]
): Course | undefined {
  for (let group of groups) {
    for (let course of getCoursesFromGroups([group])) {
      if (course.id === id) {
        return {
          ...course,
          type: "course",
          color: group.color,
          violations: [],
        };
      }
    }
  }
  console.warn("Could not find course with id: " + id);
}

export function configGroupsToGroups(groups: InitialGroupType[]): Group[] {
  const allGroups: Group[] = [];

  for (let group of groups) {
    if ("courses" in group) {
      allGroups.push({
        ...group,
        type: COURSE_GROUP,
        courses: getCoursesFromGroups([group]),
        color: group.color,
      });
    } else if ("groups" in group) {
      const myGroups = configGroupsToGroups(group.groups);
      allGroups.push({
        ...group,
        type: COMPOSITE_GROUP,
        groups: myGroups,
        color: group.color,
      });
    }
  }
  return allGroups;
}

export function isStorageId(id: string | null | undefined) {
  return id === STORAGE || id === PSEUDO_STORAGE;
}

export function splitGroupIds(groupId: string) {
  const result = [];

  for (let i = 0; i < groupId.split("-").length; i++) {
    result.push(groupId.slice(0, 3 + i * 4));
  }
  return result;
}

export function removeCoursesFromGroupList(
  groups: Group[],
  toRemove: string[]
): Group[] {
  const result = [];

  for (let group of groups) {
    if (group.type === COURSE_GROUP) {
      result.push({
        ...group,
        courses: group.courses.filter(
          (c) => toRemove.findIndex((id) => c.id === id) === -1
        ),
      });
    } else if (group.type === COMPOSITE_GROUP) {
      result.push({
        ...group,
        groups: removeCoursesFromGroupList(group.groups, toRemove),
      });
    }
  }
  return result;
}

export function getGroupIdOfCourseId(id: string) {
  return id.slice(0, id.length - 4);
}

export function isSemesterId(id: string) {
  return id.startsWith("sem") && !isNaN(Number(id.slice(3)));
}

export function isGroupId(id: string) {
  return /^\d\d\d(-\d\d\d)*$/.test(id);
}
