import {createReducer} from '@reduxjs/toolkit'
import Course, {CurriculumType} from "../../types";
import courses from "../../data/courses.json";
import semesterConstraints from "../../data/semesterConstraints.json"
import {
    addSemester, hideConstraintIndicators,
    moveCourse,
    moveCourseInList,
    removeSemester, setCustomStudies, setStartSemester,
    showConstraintIndicators,
} from "./data.actions";
import curriculumWS6S from '../../data/examples/WS6Semester.json'

interface INITIAL_STATE_TYPE {
    startSemester: "WS" | "SS"
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

const examplePlan: { courses: string[], customECTs: number }[] = curriculumWS6S



const exampleCurriculum: CurriculumType = {
    semesters: examplePlan.map(item => ({
        courses: item.courses.map(id => getCourseById(id)),
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


const initialState: INITIAL_STATE_TYPE = {
    startSemester: "WS",
    storage: [],
    curriculum: exampleCurriculum
};

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

            // add courses to storage
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
            state.startSemester = payload.startSemester;
            console.log(JSON.stringify(state.curriculum.semesters.map(s => ({
                courses: s.courses.map(c => c.id),
                customECTs: s.customEcts
            }))))
        })

        .addCase(setCustomStudies, (state, {payload}) => {
            state.curriculum.semesters[payload.semesterIndex].customEcts = payload.ects;
        })
})


// we are now assuming semester 1,3,5.. are WS and others are SS
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