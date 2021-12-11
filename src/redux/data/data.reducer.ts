import {AnyAction, createReducer} from '@reduxjs/toolkit'
import Course, {CurriculumType, Group, SemesterType} from "../../types/types";
import {
    addSemester,
    hideConstraintIndicators,
    moveCourse,
    moveGroup,
    removeSemester,
    setApplicationState,
    setCourseGrade,
    setCustomStudies,
    setExampleCurriculum,
    setStartSemester,
    showConstraintIndicators,
} from "./data.actions";
import initialConfig, {getCoursesFromGroups, getGroupWithIdFromGroups, InitialGroupType} from "../../data";
import {COMPOSITE_GROUP, COURSE_GROUP, PSEUDO_STORAGE, STORAGE} from "../../types/dndTypes";

interface INITIAL_STATE_TYPE {
    initialConfig: typeof initialConfig
    selectSemesterList: string[]
    startSemester: "WS" | "SS"
    startSemesterIndex: number,
    currentSemesterIndex: number
    storage: Group[]
    curriculum: CurriculumType,
    lastChosenExample: number
}


const yearOffset = 4
const monthOffset = yearOffset * 2
export const startYear = new Date().getFullYear() - yearOffset
const selectOptions = monthOffset + 12
const selectSemesterList: string[] = Array.from(Array(selectOptions).keys()).map(n =>
    (n % 2 === 0
        ? "WS" + (startYear + n / 2) + "/" + (startYear - 1999 + n / 2)
        : "SS" + (startYear + 1 + Math.floor(n / 2))))


export function getSemesterName(index: number, startSemesterIndex: number) {
    const n = index + startSemesterIndex
    if (n % 2 === 0)
        return "WS" + (startYear + n / 2)
    //+ "/" + (startYear - 1999 + n / 2)
    else return "SS" + (startYear + 1 + Math.floor(n / 2))
}

const getCurrentSemester = () => {
    if (new Date().getMonth() < 4) {
        return monthOffset - 1
    } else if (new Date().getMonth() < 10) {
        return monthOffset
    }
    return monthOffset + 1
}

const initialState: INITIAL_STATE_TYPE = {
    initialConfig: initialConfig,
    selectSemesterList: selectSemesterList,
    startSemester: "WS",
    startSemesterIndex: monthOffset,
    currentSemesterIndex: getCurrentSemester(),
    storage: configGroupsToGroups(initialConfig.groups),
    curriculum: {
        semesters: Array.from([0, 1, 2, 3, 4, 5]).map(a => ({number: a, id: "00" + a, courses: [], customEcts: 0}))
    },
    lastChosenExample: -1
}

// checking Course Constraints after most actions
const checkCourseConstraintsMatcher = (action: AnyAction) => (!setCustomStudies.match(action) && !showConstraintIndicators.match(action))

const courseReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setExampleCurriculum, (state, {payload}) => {
            state.lastChosenExample = payload.exampleIndex

            if (payload.exampleIndex < 0) {
                // remove whole curriculum and put all into storage
                // todo load saved custom configuration
                state.storage = configGroupsToGroups(state.initialConfig.groups)
                state.curriculum = {
                    semesters: Array.from([0, 1, 2, 3, 4, 5]).map(a => ({
                        number: a,
                        id: "00" + a,
                        courses: [],
                        customEcts: 0
                    }))
                }
                return
            }

            // set start semester to correct semester type
            if (state.startSemester !== state.initialConfig.examples[payload.exampleIndex].startsWith) {
                if (state.startSemester === "WS") {
                    // shift higher
                    state.startSemesterIndex = state.startSemesterIndex + 1
                    state.startSemester = "SS"
                } else {
                    // shift lower
                    state.startSemesterIndex = state.startSemesterIndex - 1
                    state.startSemester = "WS"
                }
            }

            state.storage = removeCoursesFromGroupList(state.storage, state.initialConfig.examples[payload.exampleIndex].curriculum.flatMap(s => s.courses))
            state.curriculum = {
                semesters: state.initialConfig.examples[payload.exampleIndex].curriculum.map(item => {
                    const courses: Course[] = []
                    for (let course of item.courses.map(id => getCourseById(id, state.initialConfig.groups))) {
                        if (course !== undefined) courses.push(course)
                    }
                    return {
                        courses: courses,
                        customEcts: item.customECTs
                    }
                })
            }
        })
        .addCase(moveCourse, (state, {payload}) => {
            if (isGroupId(payload.sourceId) && isStorageId(payload.destinationId)) {
                // moving Course from storage to storage
                // do nothing
            } else if (isSemesterId(payload.sourceId) && isSemesterId(payload.destinationId)) {
                // moving between semesters

                // find semester
                const sourceSemesterIndex = Number(payload.sourceId.slice(3))
                const destinationSemesterIndex = Number(payload.destinationId.slice(3))
                const sourceCourseIndex = state.curriculum.semesters[sourceSemesterIndex].courses.findIndex(c => c.id === payload.courseId)
                // const destinationCourseIndex = state.curriculum.semesters[destinationSemesterIndex].courses.findIndex(c => c.id === payload.courseId)

                // remove course from semester list
                const course = state.curriculum.semesters[sourceSemesterIndex].courses.splice(sourceCourseIndex, 1)[0]

                // add course to semester
                state.curriculum.semesters[destinationSemesterIndex].courses.splice(payload.destinationIndex, 0, course);

            } else if (isGroupId(payload.sourceId) && isSemesterId(payload.destinationId)) {
                // find semester
                const semesterIndex = Number(payload.destinationId.slice(3))
                moveCourseFromStorageToCurriculum(state.curriculum, state.storage, payload.sourceId, payload.courseId, semesterIndex, payload.destinationIndex)

            } else if (isStorageId(payload.destinationId)) {
                // find semester
                const semesterIndex = Number(payload.sourceId.slice(3))
                moveCourseFromCurriculumToStorage(state.curriculum, state.storage, getGroupIdOfCourseId(payload.courseId), payload.courseId, semesterIndex)
            }
            console.debug("Successfully moved curse with id " + payload.courseId + " from list " + payload.sourceId + " to " + payload.destinationId)
        })
        .addCase(moveGroup, (state, {payload}) => {

            if (isStorageId(payload.destinationId)) return
            // find semester
            const semesterIndex = Number(payload.destinationId.slice(3))
            const group = getGroupWithIdFromGroups(state.storage, payload.groupId)
            if (group === undefined) return

            // if x out of y constraint exists on group or top group, only move as many courses to fulfill ects constraint
            const constraint = getXOutOfYConstraint(payload.groupId, state.initialConfig.constraints.xOutOfYConstraints)

            const courses = getCoursesFromGroups([group])

            if (constraint === undefined) {
                for (let id of courses.map(c => c.id)) {
                    moveCourseFromStorageToCurriculum(state.curriculum, state.storage, getGroupIdOfCourseId(id), id, semesterIndex, payload.destinationIndex)
                }
                return
            }

            // we found a xOutOfYConstraint
            // move only courses to the curriculum until constraint is at its limit or violated
            // todo added courses ects should not start at 0 but rather at the current ectscount f courses of this gruop in the curriculum
            const maxEcts = constraint.maxEcts
            for (let i = 0, addedCoursesEcts = 0; i < courses.length && addedCoursesEcts < maxEcts; i++, addedCoursesEcts += courses[i].ects) {
                moveCourseFromStorageToCurriculum(
                    state.curriculum,
                    state.storage,
                    getGroupIdOfCourseId(courses[i].id),
                    courses[i].id,
                    semesterIndex,
                    payload.destinationIndex)
            }
        })
        .addCase(addSemester, (state) => {
            state.curriculum.semesters.push({courses: [], customEcts: 0})
        })

        .addCase(removeSemester, (state, {payload}) => {
            for (let id of state.curriculum.semesters[payload.semesterIndex].courses.map(c => c.id)) {
                moveCourseFromCurriculumToStorage(state.curriculum, state.storage, getGroupIdOfCourseId(id), id, payload.semesterIndex)
            }
            state.curriculum.semesters.splice(payload.semesterIndex, 1)
        })
        // .addCase(showConstraintIndicators, (state, {payload}) => {
        //     const course = initialConfig.groups.flatMap(g => g.courses).find(c => c.id === payload.courseId)
        //     if (!course) return;
        //     // semester constraint checking
        //
        //     // there should only be a single semester constraint, if there are multiple we take only the first one
        //     let semesterSign: "SS" | "WS" | undefined = initialConfig.constraints.semesterConstraints.WS.find(id => id === course.id) ? "WS" : undefined;
        //     if (!semesterSign) semesterSign = initialConfig.constraints.semesterConstraints.SS.find(id => id === course.id) ? "SS" : undefined;
        //     if (!semesterSign) {// color all black
        //         for (let i = 0; i < state.curriculum.semesters.length; i++) {
        //             state.curriculum.semesters[i].dropColor = "#000000"
        //         }
        //     } else {// color red or black depending on constraints
        //         for (let i = 0; i < state.curriculum.semesters.length; i++) {
        //             state.curriculum.semesters[i].dropColor = checkSemesterConstraint(state.startSemester, semesterSign, i) ? "#00ff00" : "#ff0000"
        //         }
        //     }
        // })
        .addCase(hideConstraintIndicators, (state) => {
            for (let i = 0; i < state.curriculum.semesters.length; i++) {
                state.curriculum.semesters[i].dropColor = undefined
            }
        })
        .addCase(setStartSemester, (state, {payload}) => {
            state.startSemesterIndex = payload.startSemesterIndex
            state.startSemester = payload.startSemesterIndex % 2 === 0 ? "WS" : "SS";
        })

        .addCase(setCustomStudies, (state, {payload}) => {
            state.curriculum.semesters[payload.semesterIndex].customEcts = payload.ects;
        })

        .addCase(setCourseGrade, (state, {payload}) => {

            for (let semester of state.curriculum.semesters) {
                for (let course of semester.courses) {
                    if (course.id === payload.courseId) {
                        course.grade = payload.grade;
                        return
                    }
                }
            }
            // for (let j = 0; j < state.curriculum.semesters.length; j++) {
            //     for (let k = 0; k < state.curriculum.semesters[j].courses.length; k++) {
            //         if (state.curriculum.semesters[j].courses[k].id === payload.courseId) {
            //             if (payload.grade === 0) {
            //                 state.curriculum.semesters[j].courses[k].grade = undefined;
            //             } else {
            //                 state.curriculum.semesters[j].courses[k].grade = payload.grade;
            //             }
            //             return
            //         }
            //     }
            // }
        })
        // .addCase(setCourseFinished, (state, {payload}) => {
        //
        //     for (let j = 0; j < state.curriculum.semesters.length; j++) {
        //         for (let k = 0; k < state.curriculum.semesters[j].courses.length; k++) {
        //             if (state.curriculum.semesters[j].courses[k].id === payload.courseId) {
        //                 state.curriculum.semesters[j].courses[k].finished = true;
        //                 // state.curriculum.semesters[j].courses[k].finished = true;
        //                 return
        //             }
        //         }
        //     }
        // })
        // .addCase(setCourseUnfinished, (state, {payload}) => {
        //
        //     for (let j = 0; j < state.curriculum.semesters.length; j++) {
        //         for (let k = 0; k < state.curriculum.semesters[j].courses.length; k++) {
        //             if (state.curriculum.semesters[j].courses[k].id === payload.courseId) {
        //                 state.curriculum.semesters[j].courses[k].finished = false;
        //                 return
        //             }
        //         }
        //     }
        // })
        .addCase(setApplicationState, (state, {payload}) => {
            state.storage = removeCoursesFromGroupList(configGroupsToGroups(state.initialConfig.groups),
                payload.curriculum.semesters.flatMap(s => s.courses).map(c => c.id))
            state.curriculum = payload.curriculum
        })
        .addMatcher((() => true), ((_, action) => {
            console.log(action)
        }))
        .addMatcher(checkCourseConstraintsMatcher, (state, {payload}) => {
            for (let i = 0; i < state.curriculum.semesters.length; i++) {
                for (let course of state.curriculum.semesters[i].courses) {
                    course.violations = []
                    checkSemesterConstraints(state, course, i);
                    checkSteopConstraints(state, course, i);
                    checkDependencyConstraints(state, course, i);
                }
            }
            checkXOutOfYConstraints(state);
        })
})

function removeCoursesFromGroupList(groups: Group[], toRemove: string[]): Group[] {
    const result = []

    for (let group of groups) {
        if (group.type === COURSE_GROUP) {
            result.push({
                ...group,
                courses: group.courses.filter(c => toRemove.findIndex(id => c.id === id) === -1)
            })
        } else if (group.type === COMPOSITE_GROUP) {
            result.push({
                ...group,
                groups: removeCoursesFromGroupList(group.groups, toRemove)
            })
        }
    }
    return result
}

function moveCourseFromStorageToCurriculum(curriculum: CurriculumType, groups: Group[], groupId: string, courseId: string, semesterIndex: number, destinationIndex: number) {

    for (let group of groups) {
        if (group.id === groupId && group.type === COURSE_GROUP) {
            const courseIndex = group.courses.findIndex(c => c.id === courseId)
            if (courseIndex !== -1) {
                // remove course from Storage
                const course = group.courses.splice(courseIndex, 1)[0]

                // add course to semester
                curriculum.semesters[semesterIndex].courses.splice(destinationIndex, 0, course);
            }
            return
        } else if (groupId.startsWith(group.id) && group.type === COMPOSITE_GROUP) {
            // we must go deeper
            moveCourseFromStorageToCurriculum(curriculum, group.groups, groupId, courseId, semesterIndex, destinationIndex)
        }
    }
}

function moveCourseFromCurriculumToStorage(curriculum: CurriculumType, groups: Group[], groupId: string, courseId: string, semesterIndex: number) {
    for (let group of groups) {
        if (group.id === groupId && group.type === COURSE_GROUP) {
            const courseIndex = curriculum.semesters[semesterIndex].courses.findIndex(c => c.id === courseId)
            if (courseIndex !== -1) {

                // remove course from semester list set finished attribute false
                const course = {
                    ...curriculum.semesters[semesterIndex].courses.splice(courseIndex, 1)[0],
                    finished: false,
                    violations: []
                }

                // add course to storage
                group.courses.splice(0, 0, course);
            }
            return
        } else if (groupId.startsWith(group.id) && group.type === COMPOSITE_GROUP) {
            // we must go deeper
            moveCourseFromCurriculumToStorage(curriculum, group.groups, groupId, courseId, semesterIndex)
        }
    }
}

function checkDependencyConstraints(state: INITIAL_STATE_TYPE, course: Course, i: number) {

    // checking dependency constraints
    const constraints = state.initialConfig.constraints.dependencyConstraints.find(c => c.course === course.id)
    if (constraints !== undefined && constraints.dependsOn.length !== 0) {

        // check if prior courses are in same semester or before -- check if they are after
        const violatingDependencies = findCoursesNotBefore(
            constraints.dependsOn,
            i + 1,
            state.curriculum.semesters,
            state.initialConfig.groups)

        if (violatingDependencies.length > 0) {
            course.violations.push({
                severity: "LOW",
                reason: ["Es wird empfohlen folgende Kurse im selben oder einem früheren Semester zu belegen:",
                    ...violatingDependencies.map(c => c.sign + " - " + c.title)]
            })
        }
    }
}

function checkSteopConstraints(state: INITIAL_STATE_TYPE, course: Course, semesterIndex: number) {
    // checking steop constraint
    if (!courseIsSteop(course.id) && !allowedBeforeSteopFinished(course.id)) {
        // check that all steop courses are booked before this semester

        const violatingSteopCourses = findCoursesNotBefore(
            state.initialConfig.constraints.steopConstraints.steop,
            semesterIndex,
            state.curriculum.semesters,
            state.initialConfig.groups)
        if (violatingSteopCourses.length > 0) {
            course.violations.push({
                severity: "HIGH",
                reason: ["Kann nicht belegt werden, da folgende StEOP Kurse nicht vor diesem Semester abgeschlossen sind:",
                    ...violatingSteopCourses.map(c => c.sign + " - " + c.title)]
            })
        }
    }
}

function checkSemesterConstraints(state: INITIAL_STATE_TYPE, course: Course, semesterIndex: number) {
    const courseSemesterSign = getSemesterConstraint(course.id);
    if (courseSemesterSign) {
        if (!checkSemesterConstraint(state.startSemester, courseSemesterSign, semesterIndex)) {
            course.violations.push({
                severity: "HIGH",
                reason: "Wird nur im " + courseSemesterSign + " angeboten"
            })
        }
    }
}

function checkXOutOfYConstraints(state: INITIAL_STATE_TYPE) {
    for (let constraint of state.initialConfig.constraints.xOutOfYConstraints) {
        const group = state.initialConfig.groups.find(g => g.id === constraint.group);
        if (!group) continue;

        // check if x or less ects of this group are booked
        // if not, every single one of them gets a new constraint added
        const maxEcts = constraint.maxEcts
        // const Y = constraint.y
        let ectsCount = 0;
        let foundCourses: [semesterIndex: number, courseIndex: number][] = []

        for (let i = 0; i < state.curriculum.semesters.length; i++) {
            for (let j = 0; j < state.curriculum.semesters[i].courses.length; j++) {
                if (getCoursesFromGroups([group]).findIndex(c => c.id === state.curriculum.semesters[i].courses[j].id) !== -1) {
                    ectsCount += state.curriculum.semesters[i].courses[j].ects;
                    foundCourses.push([i, j])
                }
            }
        }
        if (ectsCount > maxEcts) {
            // violation, more courses than constraint allows
            for (let indices of foundCourses) {
                state.curriculum.semesters[indices[0]].courses[indices[1]].violations.push({
                    severity: "HIGH",
                    reason: "Es können nur " + maxEcts + " ECTs "
                        + " der Gruppe "
                        + group.title
                        + " belegt werden."
                })
            }
        }
    }
}


function courseIsSteop(courseId: string): boolean {
    return initialConfig.constraints.steopConstraints.steop.findIndex(c => c === courseId) !== -1
}


function courseIsInSemester(courseId: string, semester: SemesterType): boolean {
    return semester.courses.findIndex(c => c.id === courseId) !== -1;

}

// returns an array of courses that are not booked before the semester i
function findCoursesNotBefore(idList: string[], semesterIndex: number, semesters: SemesterType[], groups: InitialGroupType[]): Course[] {
    const result = []
    for (let id of idList) {
        const course = getCourseById(id, groups);
        if (!course) continue;

        let found = false
        for (let i = 0; i < semesterIndex; i++) {
            if (courseIsInSemester(course.id, semesters[i])) {
                found = true
                break;
            }
        }
        if (!found) {
            result.push(course)
        }
    }
    return result
}

function configGroupsToGroups(groups: InitialGroupType[]): Group[] {

    const allGroups: Group[] = []

    for (let group of groups) {
        if ("courses" in group) {
            const courses = getCoursesFromGroups([group])
            allGroups.push({...group, type: COURSE_GROUP, courses: courses, color: group.color})
        } else if ("groups" in group) {
            allGroups.push({
                ...group,
                type: COMPOSITE_GROUP,
                groups: configGroupsToGroups(group.groups),
                color: group.color
            })
        }
    }
    return allGroups
}

function allowedBeforeSteopFinished(courseId: string): boolean {
    return initialConfig.constraints.steopConstraints.beforeSteopFinished.findIndex(s => s === courseId) !== -1
}

function getCourseById(id: string, groups: InitialGroupType[]): Course | undefined {
    for (let group of groups) {
        for (let course of getCoursesFromGroups([group])) {
            if (course.id === id) {
                return {...course, type: "course", color: group.color, violations: []}
            }
        }
    }
    console.warn("Could not find course with id: " + id)
}

function getSemesterConstraint(courseId: string): "SS" | "WS" | undefined {
    let courseSemesterSign: "SS" | "WS" | undefined = initialConfig.constraints.semesterConstraints.WS.find(id => id === courseId) ? "WS" : undefined;
    if (!courseSemesterSign) courseSemesterSign = initialConfig.constraints.semesterConstraints.SS.find(id => id === courseId) ? "SS" : undefined;
    return courseSemesterSign
}

function checkSemesterConstraint(startSemester: "WS" | "SS", semesterSign: "WS" | "SS", index: number): boolean {
    if (startSemester === "WS") return (semesterSign === "WS" && index % 2 === 0) || (semesterSign === "SS" && index % 2 === 1);
    else return (semesterSign === "WS" && index % 2 === 1) || (semesterSign === "SS" && index % 2 === 0)
}

function getGroupIdOfCourseId(id: string) {
    return id.slice(0, id.length - 4)
}

export function isSemesterId(id: string) {
    return id.startsWith("sem") && !isNaN(Number(id.slice(3)))
}

function isGroupId(id: string) {
    return /^\d\d\d(-\d\d\d)*$/.test(id);
}


function getXOutOfYConstraint(groupId: string, allConstraints: { maxEcts: number, group: string }[]) {
    const constraints: { maxEcts: number, group: string }[] = []

    const groupIds = splitGroupIds(groupId)

    for (let id of groupIds) {
        const constraint = allConstraints.find(c => c.group === id);
        if (constraint !== undefined) constraints.push(constraint);
    }

    if (constraints.length === 0) return undefined
    return constraints.reduce((c1, c2) => c1.maxEcts < c2.maxEcts ? c1 : c2)
}

function splitGroupIds(groupId: string) {
    const result = []

    for (let i = 0; i < groupId.split("-").length; i++) {
        result.push(groupId.slice(0, 3 + (i * 4)))
    }
    return result
}

export function isStorageId(id: string | null | undefined) {
    return id === STORAGE || id === PSEUDO_STORAGE
}

export default courseReducer
