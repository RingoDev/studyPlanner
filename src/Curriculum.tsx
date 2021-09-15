import React from "react";
import Semester from "./Semester";
import {Button} from "@material-ui/core";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {addSemester, removeSemester} from "./redux/data/data.actions";

const Curriculum = () => {

    const curriculum = useAppSelector((state) => state.data.curriculum)
    const dispatch = useAppDispatch()

    return (
        <>
            <div style={{
                margin: "0 auto",
                width: "80%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly"
            }}>
                {curriculum.semesters.map((s, index) => (
                    <div key={index} style={{flexBasis: "50%", minHeight: "20rem"}}>
                        <Semester semester={s} index={index}/>
                        <Button style={{zIndex: 2}} onClick={() => dispatch(removeSemester({semesterIndex:index}))}>Remove</Button>
                    </div>
                ))}
                <Button style={{flexBasis: "50%", minHeight: "20rem"}} onClick={() => dispatch(addSemester({}))}>Add Semester</Button>
            </div>
        </>
    )
}

export default Curriculum