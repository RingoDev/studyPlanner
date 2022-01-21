import semesterConstraints from "./semesterConstraints.json";
import steopConstraints from "./steopConstraints.json";
import dependencyConstraints from "./dependencyConstraints.json";
import xOutOfYConstraints from "./xOutOfYConstraints.json";
import groups from "./curriculum.json";
import WS6S from "./examples/WS6S.json";
import WS9S from "./examples/WS9S.json";
import SS6S from "./examples/SS6S.json";
import SS9S from "./examples/SS9S.json";
import Course, { Group } from "../types/types";

export type InitialGroupType = CompositeGroupType | StandardGroupType;

interface CompositeGroupType {
  id: string;
  title: string;
  color: string;
  groups: InitialGroupType[];
}

interface StandardGroupType {
  id: string;
  title: string;
  color: string;
  courses: CourseType[];
}

interface CourseType {
  kusssId: string;
  id: string;
  title: string;
  ects: number;
  sign: string;
}

export function getGroupWithIdFromGroups(
  configGroups: InitialGroupType[],
  id: string
): InitialGroupType | undefined {
  for (let group of configGroups) {
    if (group.id === id) return group;
    if ("groups" in group) {
      const possibleGroup = getGroupWithIdFromGroups(group.groups, id);
      if (possibleGroup) return possibleGroup;
    }
  }
}

export function getCoursesFromGroups(
  configGroups: InitialGroupType[] | Group[] | undefined
): Course[] {
  const courses: Course[] = [];

  if (configGroups === undefined) return courses;

  for (let group of configGroups) {
    if ("groups" in group) {
      courses.push(...getCoursesFromGroups(group.groups));
    } else {
      for (let course of group.courses) {
        courses.push({
          ...course,
          type: "course",
          color: group.color,
          violations: [],
          kusssId: course.kusssId,
        });
      }
    }
  }
  return courses;
}

interface InitialConfig {
  groups: InitialGroupType[];
  courses: Course[];
  constraints: {
    semesterConstraints: typeof semesterConstraints;
    steopConstraints: typeof steopConstraints;
    dependencyConstraints: typeof dependencyConstraints;
    xOutOfYConstraints: typeof xOutOfYConstraints;
  };
  examples: {
    startsWithWS: boolean;
    name: string;
    curriculum: typeof SS6S;
  }[];
}

const initialConfig: InitialConfig = {
  groups: groups,
  courses: getCoursesFromGroups(groups),
  constraints: {
    semesterConstraints: semesterConstraints,
    steopConstraints: steopConstraints,
    dependencyConstraints: dependencyConstraints,
    xOutOfYConstraints: xOutOfYConstraints,
  },
  examples: [
    {
      startsWithWS: true,
      name: "Studienplan Vollzeit WS",
      curriculum: WS6S,
    },
    {
      startsWithWS: false,
      name: "Studienplan Vollzeit SS",
      curriculum: SS6S,
    },
    {
      startsWithWS: true,
      name: "Studienplan Berufsbegleitend WS",
      curriculum: WS9S,
    },
    {
      startsWithWS: false,
      name: "Studienplan Berufsbegleitend SS",
      curriculum: SS9S,
    },
  ],
};
export default initialConfig;
