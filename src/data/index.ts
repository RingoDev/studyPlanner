import semesterConstraints from './semesterConstraints.json'
import steopConstraints from './steopConstraints.json'
import dependencyConstraints from './dependencyConstraints.json'
import xOutOfYConstraints from './xOutOfYConstraints.json'
import groups from './groups.json'
import competencies from './competencies.json'
import Course, {Group} from "../types/types";
import Color from "color";


export type InitialGroupType = CompositeGroupType | StandardGroupType

interface CompositeGroupType {
    id: string,
    title: string,
    color: string
    groups: InitialGroupType[]
}

interface StandardGroupType {
    id: string,
    title: string,
    color: string
    courses: CourseType[]
}

interface CourseType {
    kusssId: string,
    id: string
    title: string
    ects: number,
    sign: string,
}

export function getGroupWithIdFromGroups(configGroups: InitialGroupType[], id: string): InitialGroupType | undefined {

    for (let group of configGroups) {
        if (group.id === id) return group
        if ("groups" in group) {
            const possibleGroup = getGroupWithIdFromGroups(group.groups, id)
            if (possibleGroup) return possibleGroup
        }
    }
}


export function getCoursesFromGroups(configGroups: InitialGroupType[] | Group[] | undefined): Course[] {
    const courses: Course[] = []

    if (configGroups === undefined) return courses

    for (let group of configGroups) {
        if ("groups" in group) {
            courses.push(...getCoursesFromGroups(group.groups))
        } else {
            for (let course of group.courses) {
                courses.push({
                    ...course,
                    type: "course",
                    color: new Color(group.color),
                    violations: [],
                    kusssId: course.kusssId
                })
            }
        }
    }
    return courses
}

interface InitialConfig {
    competencies: typeof competencies,
    groups: InitialGroupType[],
    courses: Course[],
    constraints: {
        semesterConstraints: typeof semesterConstraints,
        steopConstraints: typeof steopConstraints,
        dependencyConstraints: typeof dependencyConstraints,
        xOutOfYConstraints: typeof xOutOfYConstraints
    }
}

const initialConfig: InitialConfig = {
    competencies: competencies,
    groups: groups,
    courses: getCoursesFromGroups(groups),
    constraints: {
        semesterConstraints: semesterConstraints,
        steopConstraints: steopConstraints,
        dependencyConstraints: dependencyConstraints,
        xOutOfYConstraints: xOutOfYConstraints
    }
}
export default initialConfig