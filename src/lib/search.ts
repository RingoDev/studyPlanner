import Course, { CompositeGroup, CourseGroup, Group } from "../types/types";
import { COURSE_GROUP } from "../types/dndTypes";
import { getCoursesFromGroups } from "../data";

export function courseMatchesSearch(course: Course, search: string) {
  if (search.trim().length === 0) return true;
  if (course.sign.search(search) !== -1) return true;
  return course.title.search(search) !== -1;
}

export function groupMatchesSearch(group: Group, search: string) {
  if (search.trim().length === 0) return true;
  if (group.type === COURSE_GROUP)
    return courseGroupMatchesSearch(group, search);
  else return compositeGroupMatchesSearch(group, search);
}

function courseGroupMatchesSearch(group: CourseGroup, search: string) {
  if (group.title.search(search) !== -1) return true;
  return getCoursesFromGroups([group]).some((c) =>
    courseMatchesSearch(c, search)
  );
}

function compositeGroupMatchesSearch(
  group: CompositeGroup,
  search: string
): boolean {
  if (group.title.search(search) !== -1) return true;
  return group.groups.some((g) => groupMatchesSearch(g, search));
}
