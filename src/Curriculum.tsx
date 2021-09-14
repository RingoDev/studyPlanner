import React from "react";
import {CurriculumType} from "./App";
import Semester from "./Semester";
import {Button} from "@material-ui/core";

interface Props {
    curriculum: CurriculumType,
    setCurriculum: React.Dispatch<React.SetStateAction<CurriculumType>>
    removeSemester: (index: number) => void
}

const Curriculum = ({curriculum, setCurriculum, removeSemester}: Props) => {

    const addSemester = () => {
        setCurriculum(prev => {
            const newSemesters = prev.semesters.slice();
            newSemesters.push({courses: []})
            return {...prev, semesters: newSemesters}
        })
    }

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
                        <Button style={{zIndex: 2}} onClick={() => removeSemester(index)}>Remove</Button>
                    </div>
                ))}
                <Button style={{flexBasis: "50%", minHeight: "20rem"}} onClick={addSemester}>Add Semester</Button>
            </div>
        </>
    )
}

export default Curriculum