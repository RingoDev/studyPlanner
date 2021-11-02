import React from "react";
import {useAppSelector} from "./redux/hooks";
import DroppableGroupList from "./components/droppableGroupList";
// import Course, {Group} from "./types/types";
// import Color from "color";
// import {getCoursesFromGroups} from "./data";

const Storage = () => {

    const storage = useAppSelector((state) => state.data.storage)
    // const groups = useAppSelector((state) => state.data.initialConfig.groups)

    // const createGroupsFromCourses = (): Group[] => {
    //     const result: Group[] = groups.map(g => {
    //         const courses: Course[] = []
    //         getCoursesFromGroups([g]).forEach(course => {
    //             const index = storage.findIndex(c => c.id === course.id)
    //             if (index !== -1) {
    //                 courses.push(storage[index])
    //             }
    //         })
    //         return {...g, type: GROUP, courses: courses, color: Color(g.color, "hex")};
    //     })
    //     result.sort((c1, c2) => {
    //         if ((c1.courses.length === 0 && c2.courses.length === 0) || (c1.courses.length !== 0 && c2.courses.length !== 0)) {
    //             return Number(c1.id) - Number(c2.id)
    //         } else return c2.courses.length - c1.courses.length
    //
    //     })
    //     return result
    // }
    return (
        <div style={{height: "100%", overflowY: "auto"}}>
            <DroppableGroupList groups={storage}/>
        </div>
    )
}

export default Storage