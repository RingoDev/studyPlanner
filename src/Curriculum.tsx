import React from "react";
import {CurriculumType} from "./App";
import Semester from "./Semester";

const Curriculum = ({curriculum}: { curriculum: CurriculumType }) => {
    return (
        <>
            <div style={{
                margin:"0 auto",
                width: "80%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly"
            }}>
                {curriculum.semesters.map(s => (
                    <div key={s.id} style={{flexBasis: "50%", minHeight:"20rem"}}>
                        <Semester semester={s}/>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Curriculum