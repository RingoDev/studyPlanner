import React from "react";
import {CurriculumType} from "./App";
import Semester from "./Semester";
import {Button} from "@material-ui/core";

interface Props {
    curriculum: CurriculumType,
    setCurriculum: React.Dispatch<React.SetStateAction<CurriculumType>>
    removeSemester: (id: string) => void
}

const Curriculum = ({curriculum, setCurriculum, removeSemester}: Props) => {

    const addSemester = () => {
        setCurriculum(prev => {
            const newSemesters = prev.semesters.slice();
            newSemesters.push({courses: [], id: "00" + prev.semesters.length, number: prev.semesters.length})
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
                {curriculum.semesters.map(s => (
                    <div key={s.id} style={{flexBasis: "50%", minHeight: "20rem"}}>
                        <Semester semester={s}/>
                        <Button style={{zIndex: 2}} onClick={() => removeSemester(s.id)}>Remove</Button>
                    </div>
                ))}
                <Button style={{flexBasis: "50%", minHeight: "20rem"}} onClick={addSemester}>Add Semester</Button>
            </div>
        </>
    )
}

export default Curriculum