import Course, { SemesterType } from "../types/types";
import initialConfig, { getCoursesFromGroups, InitialGroupType } from "../data";
import { INITIAL_STATE_TYPE } from "../redux/data/data.reducer";
import { getCourseById, splitGroupIds } from "./general";

export function getXOutOfYConstraint(
  groupId: string,
  allConstraints: { maxEcts: number; group: string }[]
) {
  const constraints: { maxEcts: number; group: string }[] = [];

  const groupIds = splitGroupIds(groupId);

  for (let id of groupIds) {
    const constraint = allConstraints.find((c) => c.group === id);
    if (constraint !== undefined) constraints.push(constraint);
  }

  if (constraints.length === 0) return undefined;
  return constraints.reduce((c1, c2) => (c1.maxEcts < c2.maxEcts ? c1 : c2));
}

export function checkDependencyConstraints(
  state: INITIAL_STATE_TYPE,
  course: Course,
  i: number
) {
  // checking dependency constraints
  const constraints =
    state.initialConfig.constraints.dependencyConstraints.find(
      (c) => c.course === course.id
    );
  if (constraints !== undefined && constraints.dependsOn.length !== 0) {
    // check if prior courses are in same semester or before -- check if they are after
    const violatingDependencies = findCoursesNotBefore(
      constraints.dependsOn,
      i + 1,
      state.curriculum.semesters,
      state.initialConfig.groups
    );

    if (violatingDependencies.length > 0) {
      course.violations.push({
        severity: "LOW",
        reason: [
          "Es wird empfohlen folgende Kurse im selben oder einem früheren Semester zu belegen:",
          ...violatingDependencies.map((c) => c.sign + " - " + c.title),
        ],
      });
    }
  }
}

function courseIsInSemester(courseId: string, semester: SemesterType): boolean {
  return semester.courses.findIndex((c) => c.id === courseId) !== -1;
}

// returns an array of courses that are not booked before the semester i
function findCoursesNotBefore(
  idList: string[],
  semesterIndex: number,
  semesters: SemesterType[],
  groups: InitialGroupType[]
): Course[] {
  const result = [];
  for (let id of idList) {
    const course = getCourseById(id, groups);
    if (!course) continue;

    let found = false;
    for (let i = 0; i < semesterIndex; i++) {
      if (courseIsInSemester(course.id, semesters[i])) {
        found = true;
        break;
      }
    }
    if (!found) {
      result.push(course);
    }
  }
  return result;
}

function allowedBeforeSteopFinished(courseId: string): boolean {
  return (
    initialConfig.constraints.steopConstraints.beforeSteopFinished.findIndex(
      (s) => s === courseId
    ) !== -1
  );
}

function courseIsSteop(courseId: string): boolean {
  return (
    initialConfig.constraints.steopConstraints.steop.findIndex(
      (c) => c === courseId
    ) !== -1
  );
}

export function checkSteopConstraints(
  state: INITIAL_STATE_TYPE,
  course: Course,
  semesterIndex: number
) {
  // checking steop constraint
  if (!courseIsSteop(course.id) && !allowedBeforeSteopFinished(course.id)) {
    // check that all steop courses are booked before this semester

    const violatingSteopCourses = findCoursesNotBefore(
      state.initialConfig.constraints.steopConstraints.steop,
      semesterIndex,
      state.curriculum.semesters,
      state.initialConfig.groups
    );
    if (violatingSteopCourses.length > 0) {
      course.violations.push({
        severity: "HIGH",
        reason: [
          "Kann nicht belegt werden, da folgende StEOP Kurse nicht vor diesem Semester abgeschlossen sind:",
          ...violatingSteopCourses.map((c) => c.sign + " - " + c.title),
        ],
      });
    }
  }
}

function checkSemesterConstraint(
  startSemester: "WS" | "SS",
  semesterSign: "WS" | "SS",
  index: number
): boolean {
  if (startSemester === "WS")
    return (
      (semesterSign === "WS" && index % 2 === 0) ||
      (semesterSign === "SS" && index % 2 === 1)
    );
  else
    return (
      (semesterSign === "WS" && index % 2 === 1) ||
      (semesterSign === "SS" && index % 2 === 0)
    );
}

function getSemesterConstraint(courseId: string): "SS" | "WS" | undefined {
  // todo don't use global variables like initialConfig
  let courseSemesterSign: "SS" | "WS" | undefined =
    initialConfig.constraints.semesterConstraints.WS.find(
      (id) => id === courseId
    )
      ? "WS"
      : undefined;
  if (!courseSemesterSign)
    courseSemesterSign = initialConfig.constraints.semesterConstraints.SS.find(
      (id) => id === courseId
    )
      ? "SS"
      : undefined;
  return courseSemesterSign;
}

export function checkSemesterConstraints(
  state: INITIAL_STATE_TYPE,
  course: Course,
  semesterIndex: number
) {
  const courseSemesterSign = getSemesterConstraint(course.id);
  if (courseSemesterSign) {
    if (
      !checkSemesterConstraint(
        state.startSemester,
        courseSemesterSign,
        semesterIndex
      )
    ) {
      course.violations.push({
        severity: "HIGH",
        reason: "Wird nur im " + courseSemesterSign + " angeboten",
      });
    }
  }
}

export function checkXOutOfYConstraints(state: INITIAL_STATE_TYPE) {
  for (let constraint of state.initialConfig.constraints.xOutOfYConstraints) {
    const group = state.initialConfig.groups.find(
      (g) => g.id === constraint.group
    );
    if (!group) continue;

    // check if x or less ects of this group are booked
    // if not, every single one of them gets a new constraint added
    const maxEcts = constraint.maxEcts;
    // const Y = constraint.y
    let ectsCount = 0;
    let foundCourses: [semesterIndex: number, courseIndex: number][] = [];

    for (let i = 0; i < state.curriculum.semesters.length; i++) {
      for (let j = 0; j < state.curriculum.semesters[i].courses.length; j++) {
        if (
          getCoursesFromGroups([group]).findIndex(
            (c) => c.id === state.curriculum.semesters[i].courses[j].id
          ) !== -1
        ) {
          ectsCount += state.curriculum.semesters[i].courses[j].ects;
          foundCourses.push([i, j]);
        }
      }
    }
    if (ectsCount > maxEcts) {
      // violation, more courses than constraint allows
      for (let indices of foundCourses) {
        state.curriculum.semesters[indices[0]].courses[
          indices[1]
        ].violations.push({
          severity: "HIGH",
          reason:
            "Es können nur " +
            maxEcts +
            " ECTs " +
            " der Gruppe " +
            group.title +
            " belegt werden.",
        });
      }
    }
  }
}
