import React from "react";
import {useAppSelector} from "./redux/hooks";
import DroppableGroupList from "./components/droppableGroupList";
import groups from './data/groups.json'
import Course, {Group} from "./types/types";
import {GROUP} from "./types/dndTypes";

const Storage = () => {

    const storage = useAppSelector((state) => state.data.storage)


    const createGroupsFromCourses = (): Group[] => {
        const result:Group[] =  groups.map(g => {
            const courses: Course[] = []
            g.courses.forEach(id => {
                const index = storage.findIndex(c => c.id === id)
                if (index !== -1) {
                    courses.push(storage[index])
                }
            })
            return {...g, type: GROUP, courses: courses};
        })
        result.sort((c1, c2) => {
            if ((c1.courses.length === 0 && c2.courses.length === 0) || (c1.courses.length !== 0 && c2.courses.length !== 0)) {
                return Number(c1.id) - Number(c2.id)
            } else return c2.courses.length - c1.courses.length

        })
        return result
    }
    return (
        <div style={{height: "100%", overflowY: "auto"}}>
            <DroppableGroupList groups={createGroupsFromCourses()}/>
        </div>
    )
}

export default Storage