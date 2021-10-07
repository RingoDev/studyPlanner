import { Droppable} from "react-beautiful-dnd";
import React from "react";
import CourseList from "./components/courseList";
import {useAppSelector} from "./redux/hooks";
import GroupList from "./components/groupList";

const Storage = () => {

    const storage = useAppSelector((state) => state.data.storage)

    return (
                <div style={{height:"100%",overflowY:"auto"}}>
                    {/*<CourseList courses={storage} outerProvided={provided} id={"storage"}/>*/}
                    <GroupList groups={storage}/>
                </div>
    )
}

export default Storage