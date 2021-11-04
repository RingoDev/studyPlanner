import React from "react";
import Semester from "./Semester";
import {Button} from "@material-ui/core";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {addSemester} from "./redux/data/data.actions";

const Curriculum = () => {

    const curriculum = useAppSelector((state) => state.data.curriculum)
    const dispatch = useAppDispatch()

    return (
        <>
            <div style={{
                margin: "0",
                marginLeft:"auto",
                marginRight:"1rem",
                width: "90%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly"
            }}>
                {curriculum.semesters.map((s, index) => (
                    <div key={index} style={{flexBasis: "50%", minHeight: "20rem",padding:"1rem"}}>
                        <Semester semester={s} index={index}/>
                    </div>
                ))}
                <Button style={{flexBasis: "50%", minHeight: "20rem"}} onClick={() => dispatch(addSemester({}))}>Semester hinzufügen</Button>
            </div>
        </>
    )
}

export default Curriculum