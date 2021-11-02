import {
    // AnyAction,
    createReducer
} from '@reduxjs/toolkit'
import Course, {CurriculumType, Group} from "../../types/types";
import {
    addSemester,
    hideConstraintIndicators,
    lockDroppables,
    // moveCourse,
    // moveGroup,
    removeSemester,
    setApplicationState,
    setCourseFinished,
    setCourseUnfinished,
    setCustomStudies,
    setStartSemester,
    // showConstraintIndicators,
    unlockDroppables,
} from "./data.actions";
import curriculumWS6S from '../../data/examples/WS6Semester.json'
import initialConfig, {getCoursesFromGroups, InitialGroupType} from "../../data";
import Color from "color";
import {COMPOSITE_GROUP, COURSE_GROUP} from "../../types/dndTypes";

interface INITIAL_STATE_TYPE {
    initialConfig: typeof initialConfig
    selectSemesterList: string[]
    startSemester: "WS" | "SS"
    startSemesterIndex: number,
    currentSemesterIndex: number
    storage: Group[]
    curriculum: CurriculumType
}


const getCourseById = (id: string): Course => {
    for (let group of initialConfig.groups) {
        for (let course of getCoursesFromGroups([group])) {
            if (course.id === id) {
                return {...course, type: "course", color: new Color(group.color, "hex"), violations: []}
            }
        }
    }
    return {
        ects: 0, id: "", kusssId: "", steop: false, title: "", sign: "*", type: "course", violations: [], color: Color()
    }
}

const getCourseColor = (id: string): Color => {
    for (let group of initialConfig.groups) {
        if (getCoursesFromGroups([group]).findIndex(c => c.id === id) !== -1) {
            return Color(group.color, "hex")
        }
    }
    return Color()
}

const examplePlan: { courses: string[], customECTs: number }[] = curriculumWS6S


const exampleCurriculum: CurriculumType = {
    semesters: examplePlan.map(item => ({
        courses: item.courses.map(id => ({...getCourseById(id), color: getCourseColor(id)})),
        customEcts: item.customECTs
    }))
}


const offset = 10
const startYear = new Date().getFullYear() - offset / 2
const selectOptions = 18
const selectSemesterList: string[] = Array.from(Array(selectOptions).keys()).map(n =>
    (n % 2 === 0
        ? "WS" + (startYear + n / 2) + "/" + (startYear - 1999 + n / 2)
        : "SS" + (startYear + 1 + Math.floor(n / 2))))


const getCurrentSemester = () => {
    if (new Date().getMonth() < 4) {
        console.log("current semester ", offset - 1, selectSemesterList[offset - 1])
        return offset - 1
    } else if (new Date().getMonth() < 10) {
        console.log("current semester ", offset, selectSemesterList[offset])
        return offset
    }
    console.log("current semester ", offset + 1, selectSemesterList[offset + 1])
    return offset + 1
}


// const createGroups = (): Group[] => {
//     return groups.map(g => ({
//         ...g,
//         type: GROUP,
//         // courses: g.courses.map(id => ({...getCourseById(id), color: getCourseColor(id)}))
//         courses: []
//     }))
// }

function configGroupsToGroups(groups: InitialGroupType[]): Group[] {

    const allGroups: Group[] = []

    for (let group of groups) {
        if ("courses" in group) {
            const courses = getCoursesFromGroups([group])
            allGroups.push({...group, type: COURSE_GROUP, courses: courses, color: Color(group.color)})
        } else if ("groups" in group) {
            allGroups.push({
                ...group,
                type: COMPOSITE_GROUP,
                groups: configGroupsToGroups(group.groups),
                color: Color(group.color)
            })
        }
    }
    return allGroups
}


const initialState: INITIAL_STATE_TYPE = {
    initialConfig: initialConfig,
    selectSemesterList: selectSemesterList,
    startSemester: "WS",
    startSemesterIndex: 0,
    currentSemesterIndex: getCurrentSemester(),
    storage: configGroupsToGroups(initialConfig.groups),
    curriculum: {
        semesters: Array.from([0, 1, 2, 3, 4, 5]).map(a => ({number: a, id: "00" + a, courses: [], customEcts: 0}))
    }
}


const removeCoursesFromGroupList = (groups: Group[], toRemove: string[]): Group[] => {
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

// uncomment for example curriculum
initialState.storage = removeCoursesFromGroupList(initialState.storage, exampleCurriculum.semesters.flatMap(s => s.courses).map(c => c.id))
initialState.curriculum = exampleCurriculum;


// checking Course Constraints after most actions
// const checkCourseConstraintsMatcher = (action: AnyAction) => !setCustomStudies.match(action) && !lockDroppables.match(action) && !showConstraintIndicators.match(action)

const courseReducer = createReducer(initialState, (builder) => {
    builder
        // .addCase(moveCourse, (state, {payload}) => {
        //     console.log("moving course")
        //     if (payload.sourceId === payload.courseId && isGroupId(payload.sourceId)) {
        //         // do nothing
        //     } else if (isGroupId(payload.sourceId)) {
        //         // moving Course from storage to curriculum
        //
        //         // find semester
        //         const semesterIndex = Number(payload.destinationId.slice(3))
        //
        //         const courseIndex = state.storage.findIndex(c => c.id === payload.courseId)
        //
        //         if (courseIndex !== -1) {
        //             // remove course from Storage
        //             const course = state.storage.splice(courseIndex, 1)[0]
        //
        //             // add course to semester
        //             state.curriculum.semesters[semesterIndex].courses.splice(0, 0, course);
        //         }
        //
        //     } else if (isStorageId(payload.destinationId)) {
        //         // moving from curriculum to storage
        //
        //
        //         // find semester
        //         const semesterIndex = Number(payload.sourceId.slice(3))
        //         const courseIndex = state.curriculum.semesters[semesterIndex].courses.findIndex(c => c.id === payload.courseId)
        //
        //
        //         console.log(payload.courseId + " course id")
        //         console.log(semesterIndex + " semester index")
        //         console.log(courseIndex + " Course Index")
        //
        //         if (courseIndex !== -1) {
        //
        //             // remove course from semester list set finished attribute false
        //             const course = {
        //                 ...state.curriculum.semesters[semesterIndex].courses.splice(courseIndex, 1)[0],
        //                 finished: false
        //             }
        //
        //             // add course to storage
        //             state.storage.splice(0, 0, course);
        //         }
        //     } else {// from semester to other semester
        //
        //         // find semester
        //         const sourceSemesterIndex = Number(payload.sourceId.slice(3))
        //         const destinationSemesterIndex = Number(payload.destinationId.slice(3))
        //         const sourceCourseIndex = state.curriculum.semesters[sourceSemesterIndex].courses.findIndex(c => c.id === payload.courseId)
        //         const destinationCourseIndex = state.curriculum.semesters[destinationSemesterIndex].courses.findIndex(c => c.id === payload.courseId)
        //
        //
        //         // remove course from semester list
        //         const course = state.curriculum.semesters[sourceSemesterIndex].courses.splice(sourceCourseIndex, 1)[0]
        //
        //         // add course to semester
        //         state.curriculum.semesters[destinationSemesterIndex].courses.splice(destinationCourseIndex, 0, course);
        //     }
        //
        //     console.log("Successfully moved curse with id " + payload.courseId + " from list " + payload.sourceId + " to " + payload.destinationId)
        // })
        // .addCase(moveGroup, (state, {payload}) => {
        //     const groupIndex = initialConfig.groups.findIndex(g => g.id === payload.groupId)
        //     // find semester
        //     const semesterIndex = Number(payload.destinationId.slice(3))
        //
        //     if (groupIndex !== -1) {
        //         const IDs = getCoursesFromGroups([initialConfig.groups[groupIndex]]).map(c => c.id)
        //         for (let id of IDs) {
        //             // check if course with id is in storage
        //             const courseIndex = state.storage.findIndex(c => c.id === id)
        //             if (courseIndex !== -1) {
        //                 // remove course from Storage
        //                 const course = state.storage.splice(courseIndex, 1)[0]
        //
        //                 // add course to semester
        //                 state.curriculum.semesters[semesterIndex].courses.splice(0, 0, course);
        //             }
        //
        //         }
        //     }
        // })
        .addCase(lockDroppables, (state, {payload}) => {
            // disable drop on course in storage with id != sourceId
            state.storage.map(group => {
                if (group.id !== payload.draggableId) {
                    console.log("disabling drop on group", group.title)
                    return {...group, dropDisabled: true}
                }
                return {group}
            })
            // disable drop on storage
        })
        .addCase(unlockDroppables, () => {

        })
        .addCase(addSemester, (state) => {
            state.curriculum.semesters.push({courses: [], customEcts: 0})
        })

        .addCase(removeSemester, (state, {payload}) => {

            // add courses to storage with reset violations
            // state.storage.push(...state.curriculum.semesters[payload.semesterIndex].courses)

            // remove semester
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
            // console.log(JSON.stringify(state.curriculum.semesters.map(s => ({
            //     courses: s.courses.map(c => c.id),
            //     customECTs: s.customEcts
            // }))))
        })

        .addCase(setCustomStudies, (state, {payload}) => {
            state.curriculum.semesters[payload.semesterIndex].customEcts = payload.ects;
        })

        .addCase(setCourseFinished, (state, {payload}) => {

            for (let j = 0; j < state.curriculum.semesters.length; j++) {
                for (let k = 0; k < state.curriculum.semesters[j].courses.length; k++) {
                    if (state.curriculum.semesters[j].courses[k].id === payload.courseId) {
                        state.curriculum.semesters[j].courses[k].finished = true;
                        return
                    }
                }
            }
        })
        .addCase(setCourseUnfinished, (state, {payload}) => {

            for (let j = 0; j < state.curriculum.semesters.length; j++) {
                for (let k = 0; k < state.curriculum.semesters[j].courses.length; k++) {
                    if (state.curriculum.semesters[j].courses[k].id === payload.courseId) {
                        state.curriculum.semesters[j].courses[k].finished = false;
                        return
                    }
                }
            }
        })


        // .addCase(setCourseCredited, (state, {payload}) => {
        //     for (let i = 0; i < state.storage.length; i++) {
        //         if (state.storage[i].id === payload.courseId) {
        //             state.storage[i].credited = true;
        //             return;
        //         }
        //     }
        //
        //     for (let j = 0; j < state.curriculum.semesters.length; j++) {
        //         for (let k = 0; k < state.curriculum.semesters[j].courses.length; k++) {
        //             if (state.curriculum.semesters[j].courses[k].id === payload.courseId) {
        //                 state.curriculum.semesters[j].courses[k].credited = true;
        //                 return
        //             }
        //         }
        //     }
        // })
        // .addCase(setCourseUncredited, (state, {payload}) => {
        //     for (let i = 0; i < state.storage.length; i++) {
        //         if (state.storage[i].id === payload.courseId) {
        //             state.storage[i].credited = false;
        //             return;
        //         }
        //     }
        //
        //     for (let j = 0; j < state.curriculum.semesters.length; j++) {
        //         for (let k = 0; k < state.curriculum.semesters[j].courses.length; k++) {
        //             if (state.curriculum.semesters[j].courses[k].id === payload.courseId) {
        //                 state.curriculum.semesters[j].courses[k].credited = false;
        //                 return
        //             }
        //         }
        //     }
        // })

        .addCase(setApplicationState, (state, {payload}) => {
            state.storage = removeCoursesFromGroupList(configGroupsToGroups(initialConfig.groups),
                payload.curriculum.semesters.flatMap(s => s.courses).map(c => c.id))
            state.curriculum = payload.curriculum
        })
        .addMatcher((() => true), ((_, action) => {
            console.log(action)
        }))
    // .addMatcher(checkCourseConstraintsMatcher, (state, {payload}) => {
    //     // console.log("Checking constraints")
    //     for (let course of state.storage) {
    //         course.violations = []
    //     }
    //
    //
    //     for (let i = 0; i < state.curriculum.semesters.length; i++) {
    //         for (let course of state.curriculum.semesters[i].courses) {
    //
    //             course.violations = []
    //
    //             // checking semester constraint
    //             // there should only be a single semester constraint, if there are multiple we take only the first one for now todo make better
    //             const courseSemesterSign = getSemesterConstraint(course.id);
    //             if (courseSemesterSign) {
    //                 if (!checkSemesterConstraint(state.startSemester, courseSemesterSign, i)) {// add violation to course
    //                     course.violations.push({
    //                         severity: "HIGH",
    //                         reason: "Can only be taken in " + courseSemesterSign
    //                     })
    //                 }
    //             }
    //
    //             // checking steop constraint
    //             if (!courseIsSteop(course.id)) {
    //                 if (!allowedBeforeSteopFinished(course.id)) {
    //                     // check that all steop courses are booked before this semester
    //
    //                     const violatingSteopCourses = findCoursesNotBefore(initialConfig.constraints.steopConstraints.steop, i, state.curriculum.semesters)
    //                     for (let foundCourse of violatingSteopCourses) {
    //                         course.violations.push({
    //                             severity: "HIGH",
    //                             reason: "Can not be booked because the required StEOP course: " +
    //                                 foundCourse.sign +
    //                                 " - " +
    //                                 foundCourse.title +
    //                                 " is not finished before this semester"
    //                         })
    //                     }
    //                 }
    //             }
    //
    //             // checking dependency constraints
    //             const constraints = initialConfig.constraints.dependencyConstraints.find(c => c.course === course.id)
    //             if (constraints !== undefined && constraints.dependsOn.length !== 0) {
    //
    //                 // check if prior courses are in same semester or before -- check if they are after
    //                 const violatingDependencies = findCoursesNotBefore(constraints.dependsOn, i + 1, state.curriculum.semesters)
    //                 // console.log("violating dependencies:",violatingDependencies)
    //                 for (let foundCourse of violatingDependencies) {
    //                     course.violations.push({
    //                         severity: "LOW",
    //                         reason: "It is recommended to book the course: " +
    //                             foundCourse.sign +
    //                             " - " +
    //                             foundCourse.title +
    //                             " before or in the same semester"
    //                     })
    //                 }
    //
    //             }
    //         }
    //     }
    //
    //     for (let constraint of initialConfig.constraints.xOutOfYConstraints) {
    //         const group = initialConfig.groups.find(g => g.id === constraint.group);
    //         if (!group) continue;
    //
    //         // check if x or less ects of this group are booked
    //         // if not, every single one of them gets a new constraint added
    //
    //         const maxEcts = constraint.maxEcts
    //         // const Y = constraint.y
    //         let ectsCount = 0;
    //         let foundCourses: [semesterIndex: number, courseIndex: number][] = []
    //
    //         for (let i = 0; i < state.curriculum.semesters.length; i++) {
    //             for (let j = 0; j < state.curriculum.semesters[i].courses.length; j++) {
    //                 if (getCoursesFromGroups([group]).findIndex(c => c.id === state.curriculum.semesters[i].courses[j].id) !== -1) {
    //                     ectsCount += state.curriculum.semesters[i].courses[j].ects;
    //                     foundCourses.push([i, j])
    //                 }
    //             }
    //         }
    //
    //         if (ectsCount > maxEcts) {
    //             // violation, more courses than constraint allows
    //             for (let indices of foundCourses) {
    //
    //                 state.curriculum.semesters[indices[0]].courses[indices[1]].violations.push({
    //                     severity: "HIGH",
    //                     reason: "Es können nur " + maxEcts + " ECTs "
    //                         + " der Gruppe "
    //                         + group.title
    //                         + " belegt werden."
    //                 })
    //             }
    //         }
    //
    //     }
    // })
})

// function courseIsSteop(courseId: string): boolean {
//     return initialConfig.constraints.steopConstraints.steop.findIndex(c => c === courseId) !== -1
// }
//
//
// function courseIsInSemester(courseId: string, semester: SemesterType): boolean {
//     return semester.courses.findIndex(c => c.id === courseId) !== -1;
//
// }

// returns an array of courses that are not booked before the semester i
// function findCoursesNotBefore(idList: string[], semesterIndex: number, semesters: SemesterType[]): Course[] {
//     const result = []
//     for (let id of idList) {
//         const course = getCourseById(id);
//         if (!course) continue;
//
//         let found = false
//         for (let i = 0; i < semesterIndex; i++) {
//             if (courseIsInSemester(course.id, semesters[i])) {
//                 found = true
//                 break;
//             }
//         }
//         if (!found) {
//             // we didnt find the steop course --bad
//             // console.log("Found non booked course: " + course.title)
//             result.push(course)
//         }
//     }
//     return result
// }

// function allowedBeforeSteopFinished(courseId: string): boolean {
//     return initialConfig.constraints.steopConstraints.beforeSteopFinished.findIndex(s => s === courseId) !== -1
// }
//
// function getSemesterConstraint(courseId: string): "SS" | "WS" | undefined {
//     let courseSemesterSign: "SS" | "WS" | undefined = initialConfig.constraints.semesterConstraints.WS.find(id => id === courseId) ? "WS" : undefined;
//     if (!courseSemesterSign) courseSemesterSign = initialConfig.constraints.semesterConstraints.SS.find(id => id === courseId) ? "SS" : undefined;
//     return courseSemesterSign
//
// }
//
// function checkSemesterConstraint(startSemester: "WS" | "SS", semesterSign: "WS" | "SS", index: number): boolean {
//     if (startSemester === "WS") return (semesterSign === "WS" && index % 2 === 0) || (semesterSign === "SS" && index % 2 === 1);
//     else return (semesterSign === "WS" && index % 2 === 1) || (semesterSign === "SS" && index % 2 === 0)
// }

// function arrayMove<T>(oldIndex: number, newIndex: number, list: T[]) {
//
//     // copy array
//     const newList = list.slice();
//
//     // remove from old Index
//     const object = newList.splice(oldIndex, 1)[0]
//
//     // insert at different Index
//     newList.splice(newIndex, 0, object)
//
//     return newList
// }
//
// function findGroupIdOfCourse(courseId: string): string | undefined {
//     const groupIndex = initialConfig.groups.findIndex(g => g.courses.findIndex(id => id === courseId) !== -1)
//     if (groupIndex === -1) return;
//     return initialConfig.groups[groupIndex].id
// }


// function isGroupId(id: string) {
//     return !isNaN(Number(id)) && id.length === 3
// }
//
// function isStorageId(id: string) {
//     return id === "storage"
// }


export default courseReducer