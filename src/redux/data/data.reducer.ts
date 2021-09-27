import {AnyAction, createReducer} from '@reduxjs/toolkit'
import Course, {CurriculumType, SemesterType} from "../../types";
import courses from "../../data/courses.json";
import semesterConstraints from "../../data/semesterConstraints.json"
import steopConstraints from '../../data/steopConstraints.json'
import dependencyConstraints from '../../data/dependencyConstraints.json'
import {
    addSemester,
    hideConstraintIndicators,
    moveCourse,
    moveCourseInList,
    removeSemester,
    setCustomStudies,
    setStartSemester,
    showConstraintIndicators,
} from "./data.actions";
import curriculumWS6S from '../../data/examples/WS6Semester.json'
import groups from '../../data/groups.json'

interface INITIAL_STATE_TYPE {
    selectSemesterList: string[]
    startSemester: "WS" | "SS"
    startSemesterIndex: number,
    currentSemesterIndex: number
    storage: Course[]
    curriculum: CurriculumType
}

const getCourseById = (id: string): Course => {
    const course = courses.find(c => c.id === id)
    if (course === undefined) {
        // should never happen
        return {
            ects: 0, id: "", kusssId: "", steop: false, title: "", sign: "*", type: "course"
        }
    }
    return {...course, type: "course"}
}

const getCourseColor = (id: string): string | undefined => {
    for (let group of groups) {
        if (group.courses.findIndex(c => c === id) !== -1) {
            return group.color
        }
    }
}

const examplePlan: { courses: string[], customECTs: number }[] = curriculumWS6S


const exampleCurriculum: CurriculumType = {
    semesters: examplePlan.map(item => ({
        courses: item.courses.map(id => ({...getCourseById(id), color: getCourseColor(id)})),
        customEcts: item.customECTs
    }))
}

// const initialState: INITIAL_STATE_TYPE = {
//     startSemester: "WS",
//     storage: courses.map(c => ({...c,type:"course"})),
//     curriculum: {
//         semesters: Array.from([0, 1, 2, 3, 4, 5]).map(a => ({number: a, id: "00" + a, courses: [], customEcts: 0}))
//     }
// };

const offset = 10
const startYear = new Date().getFullYear() - offset/2
const selectOptions = 18
const selectSemesterList: string[] = Array.from(Array(selectOptions).keys()).map(n =>
    (n % 2 === 0
        ? "WS" + (startYear + n / 2) + "/" + (startYear - 1999 + n / 2)
        : "SS" + (startYear + 1 + Math.floor(n / 2))))


const getCurrentSemester = () => {
    // todo don't rely on starting selection year being current year - 3
    if (new Date().getMonth() < 4) {
        console.log("current semester ", offset-1, selectSemesterList[offset-1])
        return offset-1
    } else if (new Date().getMonth() < 10) {
        console.log("current semester ", offset, selectSemesterList[offset])
        return offset
    }
    console.log("current semester ", offset+1, selectSemesterList[offset+1])
    return offset+1
}


const initialState: INITIAL_STATE_TYPE = {
    selectSemesterList: selectSemesterList,
    startSemester: "WS",
    startSemesterIndex: 0,
    currentSemesterIndex: getCurrentSemester(),
    storage: [],
    curriculum: exampleCurriculum
};

// checking Course Constraints after most actions
const checkCourseConstraintsMatcher = (action: AnyAction) => !setCustomStudies.match(action) && !showConstraintIndicators.match(action) && !moveCourseInList.match(action)

const courseReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(moveCourse, (state, {payload}) => {
            if (payload.sourceId === "storage") {// moving from storage to curriculum

                // find semester
                const semesterIndex = Number(payload.destinationId.slice(3))

                // remove course from storage list
                const course = state.storage.splice(payload.sourceIndex, 1)[0]

                // add course to semester
                state.curriculum.semesters[semesterIndex].courses.splice(payload.destinationIndex, 0, course);
            } else if (payload.destinationId === "storage") { // moving from curriculum to storage

                // find semester
                const semesterIndex = Number(payload.sourceId.slice(3))

                // remove course from semester list
                const course = state.curriculum.semesters[semesterIndex].courses.splice(payload.sourceIndex, 1)[0]

                // add course to storage
                state.storage.splice(payload.destinationIndex, 0, course);
            } else {// from semester to other semester

                // find semester
                const sourceSemesterIndex = Number(payload.sourceId.slice(3))
                const destinationSemesterIndex = Number(payload.destinationId.slice(3))

                // remove course from semester list
                const course = state.curriculum.semesters[sourceSemesterIndex].courses.splice(payload.sourceIndex, 1)[0]

                // add course to semester
                state.curriculum.semesters[destinationSemesterIndex].courses.splice(payload.destinationIndex, 0, course);
            }

            // sort storage
            state.storage.sort((c1, c2) => Number(c1.id) - Number(c2.id))
            console.log("Successfully moved curse with id " + payload.courseId + " from list " + payload.sourceId + " to " + payload.destinationId)
        })
        .addCase(moveCourseInList, (state, {payload}) => {
            if (payload.listId === "storage") {// we are shuffling in storage list
                // do nothing
                // state.storage = arrayMove(payload.sourceIndex, payload.destinationIndex, state.storage)
            } else {// we are shuffling in a semester list

                // get semesterIndex from the semesterId
                const semesterIndex = Number(payload.listId.slice(3))

                if (isNaN(semesterIndex)) {
                    console.error("weird semester index wasn't found: " + payload.listId)
                    return
                }
                state.curriculum.semesters[semesterIndex].courses = arrayMove(payload.sourceIndex, payload.destinationIndex, state.curriculum.semesters[semesterIndex].courses)
            }
        })
        .addCase(addSemester, (state) => {
            state.curriculum.semesters.push({courses: [], customEcts: 0})
        })

        .addCase(removeSemester, (state, {payload}) => {

            // add courses to storage with reset violations
            state.storage.push(...state.curriculum.semesters[payload.semesterIndex].courses)

            // remove semester
            state.curriculum.semesters.splice(payload.semesterIndex, 1)
        })
        .addCase(showConstraintIndicators, (state, {payload}) => {

            const course = courses.find(c => c.id === payload.courseId)
            if (!course) return;

            // semester constraint checking

            // there should only be a single semester constraint, if there are multiple we take only the first one for now todo make better
            let semesterSign: "SS" | "WS" | undefined = semesterConstraints.WS.find(id => id === course.id) ? "WS" : undefined;
            if (!semesterSign) semesterSign = semesterConstraints.SS.find(id => id === course.id) ? "SS" : undefined;
            if (!semesterSign) {// color all black
                for (let i = 0; i < state.curriculum.semesters.length; i++) {
                    state.curriculum.semesters[i].dropColor = "#000000"
                }
            } else {// color red or black depending on constraints
                for (let i = 0; i < state.curriculum.semesters.length; i++) {
                    state.curriculum.semesters[i].dropColor = checkSemesterConstraint(state.startSemester, semesterSign, i) ? "#00ff00" : "#ff0000"
                }
            }
            //todo check other constraints
        })
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

        .addMatcher(checkCourseConstraintsMatcher, (state, {payload}) => {

            console.log("Checking constraints")

            for (let course of state.storage) {
                course.violations = []
            }

            for (let i = 0; i < state.curriculum.semesters.length; i++) {
                for (let course of state.curriculum.semesters[i].courses) {
                    // removing all violations
                    course.violations = [];

                    // checking semester constraint
                    // there should only be a single semester constraint, if there are multiple we take only the first one for now todo make better
                    const courseSemesterSign = getSemesterConstraint(course.id);
                    if (courseSemesterSign) {
                        if (!checkSemesterConstraint(state.startSemester, courseSemesterSign, i)) {// add violation to course
                            course.violations.push({
                                severity: "HIGH",
                                reason: "Can only be taken in " + courseSemesterSign
                            })
                        }
                    }

                    // checking steop constraint
                    if (!courseIsSteop(course.id)) {
                        if (!allowedBeforeSteopFinished(course.id)) {
                            // check that all steop courses are booked before this semester

                            const violatingSteopCourses = findCoursesNotBefore(steopConstraints.steop, i, state.curriculum.semesters)
                            for (let foundCourse of violatingSteopCourses) {
                                course.violations.push({
                                    severity: "HIGH",
                                    reason: "Can not be booked because the required StEOP course: " +
                                        foundCourse.sign +
                                        " - " +
                                        foundCourse.title +
                                        " is not finished before this semester"
                                })
                            }
                        }
                    }

                    // checking dependency constraints
                    const constraints = dependencyConstraints.find(c => c.course === course.id)
                    if (constraints !== undefined && constraints.dependsOn.length !== 0) {

                        // check if prior courses are in same semester or before -- check if they are after
                        const violatingDependencies = findCoursesNotBefore(constraints.dependsOn, i + 1, state.curriculum.semesters)
                        // console.log("violating dependencies:",violatingDependencies)
                        for (let foundCourse of violatingDependencies) {
                            course.violations.push({
                                severity: "LOW",
                                reason: "It is recommended to book the course: " +
                                    foundCourse.sign +
                                    " - " +
                                    foundCourse.title +
                                    " before or in the same semester"
                            })
                        }

                    }
                }
            }
        })
})

function courseIsSteop(courseId: string): boolean {
    return steopConstraints.steop.findIndex(c => c === courseId) !== -1
}


function courseIsInSemester(courseId: string, semester: SemesterType): boolean {
    return semester.courses.findIndex(c => c.id === courseId) !== -1;

}

// returns an array of courses that are not booked before the semester i
function findCoursesNotBefore(idList: string[], semesterIndex: number, semesters: SemesterType[]): Course[] {
    const result = []
    for (let id of idList) {
        const course = getCourseById(id);
        if (!course) continue;

        let found = false
        for (let i = 0; i < semesterIndex; i++) {
            if (courseIsInSemester(course.id, semesters[i])) {
                found = true
                break;
            }
        }
        if (!found) {
            // we didnt find the steop course --bad
            // console.log("Found non booked course: " + course.title)
            result.push(course)
        }
    }
    return result
}

function allowedBeforeSteopFinished(courseId: string): boolean {
    return steopConstraints.beforeSteopFinished.findIndex(s => s === courseId) !== -1
}

function getSemesterConstraint(courseId: string): "SS" | "WS" | undefined {
    let courseSemesterSign: "SS" | "WS" | undefined = semesterConstraints.WS.find(id => id === courseId) ? "WS" : undefined;
    if (!courseSemesterSign) courseSemesterSign = semesterConstraints.SS.find(id => id === courseId) ? "SS" : undefined;
    return courseSemesterSign

}

function checkSemesterConstraint(startSemester: "WS" | "SS", semesterSign: "WS" | "SS", index: number): boolean {
    if (startSemester === "WS") return (semesterSign === "WS" && index % 2 === 0) || (semesterSign === "SS" && index % 2 === 1);
    else return (semesterSign === "WS" && index % 2 === 1) || (semesterSign === "SS" && index % 2 === 0)
}

function arrayMove<T>(oldIndex: number, newIndex: number, list: T[]) {

    // copy array
    const newList = list.slice();

    // remove from old Index
    const object = newList.splice(oldIndex, 1)[0]

    // insert at different Index
    newList.splice(newIndex, 0, object)

    return newList
}

export default courseReducer