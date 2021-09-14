export default interface Course {
    id: string
    title: string,
    ects: number,
    type: "VL" | "KS" | "KV" | "UE" | "PE" | "KT" | "SE" | string,
    steop?: boolean,
}

export type Constraint =
    SemesterConstraint |
    DependencyConstraint |
    SteopConstraint |
    CombinedConstraint

// can only be booked in WS or SS respectively
export interface SemesterConstraint {
    type: "semester",
    course: string
    value: "WS" | "SS",
}

// value1 depends on value2,value3...
export interface DependencyConstraint {
    type: "dependsOn",
    value: string[]
}

// these courses can be booked without steop completed -- all others can not be booked
export interface SteopConstraint {
    type: "steop",
    value: string[]
}

// these courses can only be completed together in the same semester
export interface CombinedConstraint {
    type: "combinedWith",
    value: string[]
}




