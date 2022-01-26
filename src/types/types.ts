import { COMPOSITE_GROUP, COURSE_GROUP } from "./dndTypes";
import Color from "color";

export type Grade = 0 | 1 | 2 | 3 | 4;

export default interface Course {
  type: "course";
  id: string;
  title: string;
  ects: number;
  sign: "VL" | "KS" | "KV" | "UE" | "PE" | "KT" | "SE" | "*" | string;
  steop?: boolean;
  kusssId: string;
  violations: Violation[];
  color: string;
  credited?: boolean;
  grade?: Grade;
}

export interface SemesterInfo {
  isWS: boolean;
  year: number;
}

export interface Violation {
  severity: "HIGH" | "MEDIUM" | "LOW";
  reason: string[] | string;
}

export interface CurriculumType {
  semesters: SemesterType[];
}

export interface CourseGroup {
  type: typeof COURSE_GROUP;
  courses: Course[];
  id: string;
  title: string;
  color: string;
  // dropDisabled?: boolean;
}

export interface CompositeGroup {
  type: typeof COMPOSITE_GROUP;
  groups: Group[];
  id: string;
  title: string;
  color: string;
  // dropDisabled?: boolean;
}

export type Group = CourseGroup | CompositeGroup;

export interface Competency {
  allCoursesEcts: number;
  finishedCoursesEcts: number;
  id: string;
  title: string;
  color: Color;
}

export interface DataGroup {
  id: string;
  title: string;
  courses: string[];
}

export interface SemesterType {
  name: string;
  courses: Course[];
  customEcts: number;
}

export interface SectionType {
  id: string;
  title: string;
  courses: Course[];
}

export type Constraint =
  | SemesterConstraint
  | DependencyConstraint
  | SteopConstraint
  | CombinedConstraint;

// can only be booked in WS or SS respectively
export interface SemesterConstraint {
  type: "semester";
  course: string;
  value: "WS" | "SS";
}

// value1 depends on value2,value3...
export interface DependencyConstraint {
  type: "dependsOn";
  value: string[];
}

// these courses can be booked without steop completed -- all others can not be booked
export interface SteopConstraint {
  type: "steop";
  value: string[];
}

// these courses can only be completed together in the same semester
export interface CombinedConstraint {
  type: "combinedWith";
  value: string[];
}
