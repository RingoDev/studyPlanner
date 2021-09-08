export default interface Course {
    title: string,
    ects: number,
    type: "VL" | "KS" | "KV" | "UE" | "PE" | "KT" | "SE" | string,
    constraints: Constraint[]
}

interface Constraint {
    type: "semester" | string,
    value: string
}