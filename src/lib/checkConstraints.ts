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

export function checkCombinedCoursesConstraints(
  state: INITIAL_STATE_TYPE,
  course: Course,
  i: number
) {
  const mandatoryConstraint =
    state.initialConfig.constraints.combinedCoursesConstraints.mandatory.find(
      (array) => array.find((id) => id === course.id) !== undefined
    );
  if (mandatoryConstraint !== undefined) {
    const idsOfMissingCoursesInSemester = mandatoryConstraint
      .filter((id) => id !== course.id)
      .filter(
        (id) => !state.curriculum.semesters[i].courses.some((c) => c.id === id)
      );

    if (idsOfMissingCoursesInSemester.length > 0) {
      const courses = idsOfMissingCoursesInSemester
        .map((id) => getCourseById(id, state.initialConfig.storage))
        .filter((c) => c !== undefined) as Course[];
      course.violations.push({
        severity: "HIGH",
        reason: [
          "Folgende Kurse müssen im selben Semester belegt werden",
          ...courses.map((c) => `${c.sign} - ${c.title}`),
        ],
      });
    }
    const optionalConstraint =
      state.initialConfig.constraints.combinedCoursesConstraints.mandatory.find(
        (array) => array.find((id) => id === course.id) !== undefined
      );
    if (optionalConstraint !== undefined) {
      const idsOfMissingCoursesInSemester = optionalConstraint
        .filter((id) => id !== course.id)
        .filter(
          (id) =>
            !state.curriculum.semesters[i].courses.some((c) => c.id === id)
        );

      if (idsOfMissingCoursesInSemester.length > 0) {
        const courses = idsOfMissingCoursesInSemester
          .map((id) => getCourseById(id, state.initialConfig.storage))
          .filter((c) => c !== undefined) as Course[];
        course.violations.push({
          severity: "HIGH",
          reason: [
            "Folgende Kurse müssen im selben Semester belegt werden",
            ...courses.map((c) => `${c.sign} - ${c.title}`),
          ],
        });
      }
    }
  }
}

export function checkDependencyConstraints(
  state: INITIAL_STATE_TYPE,
  course: Course,
  i: number
) {
  // checking dependency constraints
  const softConstraints =
    state.initialConfig.constraints.dependencyConstraints.optional.find(
      (c) => c.course === course.id
    );
  if (softConstraints !== undefined && softConstraints.dependsOn.length !== 0) {
    checkGenericDependencyConstraint(
      state,
      course,
      i,
      softConstraints,
      "LOW",
      "Es wird empfohlen folgende Kurse im selben oder einem früheren Semester zu belegen:"
    );
  }
  // checking dependency constraints
  const hardConstraints =
    state.initialConfig.constraints.dependencyConstraints.mandatory.find(
      (c) => c.course === course.id
    );
  if (hardConstraints !== undefined && hardConstraints.dependsOn.length !== 0) {
    checkGenericDependencyConstraint(
      state,
      course,
      i,
      hardConstraints,
      "HIGH",
      "Folgende Kurse müssen im selben oder einem früheren Semester belegt werden:"
    );
  }
}

function checkGenericDependencyConstraint(
  state: INITIAL_STATE_TYPE,
  course: Course,
  i: number,
  constraints: { course: string; dependsOn: string[] },
  severity: "HIGH" | "LOW",
  reason: string
) {
  // check if prior courses are in same semester or before -- check if they are after
  const violatingDependencies = findCoursesNotBefore(
    constraints.dependsOn,
    i + 1,
    state.curriculum.semesters,
    state.initialConfig.storage
  );
  if (violatingDependencies.length > 0) {
    course.violations.push({
      severity: severity,
      reason: [
        reason,
        ...violatingDependencies.map((c) => `${c.sign} -  ${c.title}`),
      ],
    });
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
    [...initialConfig.constraints.steopConstraints.steop.mandatory].findIndex(
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
  // violated if

  if (!courseIsSteop(course.id) && !allowedBeforeSteopFinished(course.id)) {
    // check that all mandatory steop courses are finished before this semester

    const violatingSteopCourses = findCoursesNotBefore(
      state.initialConfig.constraints.steopConstraints.steop.mandatory,
      semesterIndex,
      state.curriculum.semesters,
      state.initialConfig.storage
    );

    // check that for all of the optional steop courses atleast 1 option is fulfilled
    for (let optionalSteopObject of state.initialConfig.constraints
      .steopConstraints.steop.xOrY) {
      const oneOfOptionalSteopFinished =
        coursesAreBookedBefore(
          optionalSteopObject.x,
          semesterIndex,
          state.curriculum.semesters
        ) ||
        coursesAreBookedBefore(
          optionalSteopObject.y,
          semesterIndex,
          state.curriculum.semesters
        );

      if (!oneOfOptionalSteopFinished) {
        course.violations.push({
          severity: "HIGH",
          reason: [
            "Kann nicht belegt werden, da keiner der folgenden Steop Blöcke vollständig abgschlossen ist:",
            ...optionalSteopObject.x
              .map((id) => getCourseById(id, state.initialConfig.storage))
              .map((c) => (c === undefined ? "" : `${c.sign} -  ${c.title}`)),
            ...optionalSteopObject.y
              .map((id) => getCourseById(id, state.initialConfig.storage))
              .map((c) => (c === undefined ? "" : `${c.sign} -  ${c.title}`)),
          ],
        });
      }
    }

    if (violatingSteopCourses.length > 0) {
      course.violations.push({
        severity: "HIGH",
        reason: [
          "Kann nicht belegt werden, da folgende StEOP Kurse nicht vor diesem Semester abgeschlossen sind:",
          ...violatingSteopCourses.map((c) => `${c.sign} -  ${c.title}`),
        ],
      });
    }
  }
}

/**
 * Returns true if all of the courses in the specified idList are booked before the specified semester
 */
function coursesAreBookedBefore(
  idList: string[],
  semesterIndex: number,
  semesters: SemesterType[]
) {
  for (let id of idList) {
    if (!courseIsBookedBefore(id, semesterIndex, semesters)) return false;
  }
  return true;
}

/**
 * Returns true if the course with the specified id is booked before the specified semester
 */
function courseIsBookedBefore(
  id: string,
  semesterIndex: number,
  semesters: SemesterType[]
) {
  for (let i = 0; i < semesterIndex; i++) {
    if (courseIsInSemester(id, semesters[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if the semesterSign at the specified index is possible with the start semester configuration
 *
 * @param startSemester
 * @param semesterSign
 * @param index
 */
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

function getSemesterConstraint(
  courseId: string,
  config: typeof initialConfig
): "SS" | "WS" | undefined {
  if (config.constraints.semesterConstraints.WS.find((id) => id === courseId))
    return "WS";
  if (config.constraints.semesterConstraints.SS.find((id) => id === courseId))
    return "SS";
}

export function checkSemesterConstraints(
  state: INITIAL_STATE_TYPE,
  course: Course,
  semesterIndex: number
) {
  const courseSemesterSign = getSemesterConstraint(
    course.id,
    state.initialConfig
  );
  if (
    courseSemesterSign &&
    !checkSemesterConstraint(
      state.startSemester.isWS ? "WS" : "SS",
      courseSemesterSign,
      semesterIndex
    )
  ) {
    course.violations.push({
      severity: "HIGH",
      reason: `Wird nur im ${courseSemesterSign} angeboten`,
    });
  }
}

export function checkXOutOfYConstraints(state: INITIAL_STATE_TYPE) {
  for (let constraint of state.initialConfig.constraints.xOutOfYConstraints) {
    const group = state.initialConfig.storage.find(
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
          reason: `Es können nur ${maxEcts} ECTs der Gruppe ${group.title} belegt werden.`,
        });
      }
    }
  }
}
