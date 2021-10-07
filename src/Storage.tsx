import React from "react";
import {useAppSelector} from "./redux/hooks";
import DroppableGroupList from "./components/droppableGroupList";

const Storage = () => {

    const storage = useAppSelector((state) => state.data.storage)

    return (
                <div style={{height:"100%",overflowY:"auto"}}>
                    <DroppableGroupList groups={storage}/>
                </div>
    )
}

export default Storage