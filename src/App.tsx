import React, {useState} from 'react';
import data from './courses.json';
import {Container} from "@material-ui/core";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import Course from "./types";
import Curriculum from "./Curriculum";
import Storage from "./Storage";


export interface CurriculumType {
    semesters: SemesterType[]
}

export interface SemesterType {
    id: string,
    courses: Course[]
}

export interface SectionType {
    id: string,
    title: string
    courses: Course[]
}

const plan: CurriculumType = {
    semesters: [
        {
            id: "1",
            courses: []
        },
        {
            id: "2",
            courses: []
        },
        {
            id: "3",
            courses: []
        },
        {
            id: "4",
            courses: []
        },
        {
            id: "5",
            courses: []
        },
        {
            id: "6",
            courses: []
        },

    ]

}

const App = () => {


    const [storage, setStorage] = useState<Course[]>(data.courses)
    const [curriculum, setCurriculum] = useState<CurriculumType>(plan)

    const handleDrop = (result: DropResult) => {

        console.log(result)
        const destination = result.destination
        if (destination === undefined || destination === null) return;
        moveCourse(result.source.droppableId, destination.droppableId, result.draggableId, destination.index)
    }


    const moveCourse = (listId1: string, listId2: string, courseId: string, index: number) => {

        if (listId1 === listId2) {
            moveCourseInList(listId1, courseId, index);
        } else {
            moveCourseFromListToList(listId1, listId2, courseId, index);
        }
    }


    const moveCourseInList = (listId: string, courseId: string, index: number) => {

        // we are shuffling in main List
        if (listId === "storage") {
            setStorage((prev) => moveCourseInListToIndex(prev, courseId, index))
            return;
        }

        // we are shuffling in semester List

        // find semester
        const semesterIndex = curriculum.semesters.findIndex(s => s.id === listId)

        if (semesterIndex === -1) {
            console.error("weird semester index wasn't found: " + listId)
            return
        }

        const updatedCourses = moveCourseInListToIndex(curriculum.semesters[semesterIndex].courses, courseId, index)

        setCurriculum((prev) => {

            // copy array
            const newSemesters = prev.semesters.slice();

            // overwrite courses at of specific semester
            newSemesters[semesterIndex].courses = updatedCourses;

            return {...prev, semesters: newSemesters}
        })
    }

    const moveCourseInListToIndex = (list: Course[], courseId: string, index: number) => {
        // copy array
        const newStorage = list.slice();

        // find the old index of the course
        const oldIndex = list.findIndex(c => c.id === courseId);

        // remove from old Index
        const course = newStorage.splice(oldIndex, 1)[0]

        // insert at different Index
        newStorage.splice(index, 0, course)

        return newStorage
    }


    /**
     * returns the course corresponding to the courseId and a new list with the course removed.
     * @param courseId
     * @param list
     */
    const removeCourseFromList = (courseId: string, list: Course[]): [Course | undefined, Course[]] => {

        const courseIndex = list.findIndex(c => c.id === courseId);

        const newList = list.slice();

        if (courseIndex === -1) {
            return [undefined, newList]
        }

        const course = newList.splice(courseIndex, 1)[0]

        return [course, newList]

    }

    const addCourseToList = (course: Course, list: Course[], index: number): Course[] => {

        const newList = list.slice();

        newList.splice(index, 0, course)

        return newList
    }

    const updateState = (storageList: Course[], currList: Course[], semesterIndex: number) => {

        setStorage(() => storageList)

        setCurriculum(prev => {
            const semesters = prev.semesters.slice()
            semesters[semesterIndex].courses = currList;
            return {...prev, semesters}
        })
    }

    const moveCourseFromListToList = (listId1: string, listId2: string, courseId: string, index: number) => {
        if (listId1 === "storage") {
            // moving from storage to curriculum

            // find semester
            const semesterIndex = curriculum.semesters.findIndex(s => s.id === listId2)

            // get Course and new Storage List
            const [course, storageList] = removeCourseFromList(courseId, storage);

            if (!course) {
                console.error(" course wasn't found in storage")
                return
            }

            if (semesterIndex === -1) {
                console.error("weird semester index wasn't found: " + listId2)
                return
            }

            const currList = addCourseToList(course, curriculum.semesters[semesterIndex].courses, index);

            // setState
            updateState(storageList, currList, semesterIndex)
        } else if (listId2 === "storage") { // moving from curriculum to storage
            const semesterIndex = curriculum.semesters.findIndex(s => s.id === listId1)
            if (semesterIndex === -1) {
                console.error("didn't find semester in curriculum with id:" + listId1)
                return
            }

            // get Course and new Semester List
            const [course, semList] = removeCourseFromList(courseId, curriculum.semesters[semesterIndex].courses);

            if (!course) {
                console.error(" course with id: " + courseId + " wasn't found in semester with id: " + listId1)
                return
            }

            // get new storage List
            const storageList = addCourseToList(course, storage, index);

            // setState
            updateState(storageList, semList, semesterIndex)
        } else {

            // from semester to other semester

            const semesterIndex1 = curriculum.semesters.findIndex(s => s.id === listId1)
            const semesterIndex2 = curriculum.semesters.findIndex(s => s.id === listId2)
            if (semesterIndex1 === -1 || semesterIndex2 === -1) {
                console.error("didn't find semester in curriculum with id:" + listId1)
                return
            }

            // get Course and new Semester List
            const [course, semList1] = removeCourseFromList(courseId, curriculum.semesters[semesterIndex1].courses);

            if (!course) {
                console.error(" course with id: " + courseId + " wasn't found in semester with id: " + listId1)
                return
            }

            const semList2 = addCourseToList(course, curriculum.semesters[semesterIndex2].courses, index)

            setCurriculum(prev => {
                const semesters = prev.semesters.slice()
                semesters[semesterIndex1].courses = semList1;
                semesters[semesterIndex2].courses = semList2;
                return {...prev, semesters}
            })
        }
        console.log("Successfully moved curse with id " + courseId + " from list " + listId1 + " to " + listId2)
    }

    return (
        <div className="App">
            <header className="App-header">
            </header>
            <Container maxWidth={"xl"}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <DragDropContext onDragEnd={(result) => handleDrop(result)}>
                        <div style={{
                            maxHeight: "90vh",
                            height: "85vh",
                            overflowY: "auto",
                            flex: "0 1 20%"
                        }}>
                            <Storage storage={storage}/>
                        </div>
                        <div style={{
                            flex: "0 1 80%",
                            maxHeight: "90vh",
                            height: "85vh",
                            overflowY: "auto",
                        }}>
                            <Curriculum curriculum={curriculum}/>
                        </div>
                    </DragDropContext>
                </div>
            </Container>
        </div>
    );
}

export default App;
