import React from "react";
import Semester from "./semester";
import {Button} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {addSemester} from "../../redux/data/data.actions";
import {styled} from "@mui/material/styles";

const CurriculumContainer = styled("div")(() => ({
    margin: "0",
    marginLeft: "auto",
    marginRight: "1rem",
    width: "90%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
}))

const SemesterWrapper = styled("div")(() => ({
    flexBasis: "50%",
    minHeight: "20rem",
    padding: "1rem"
}))


const StyledButton = styled(Button)(() => ({
    flexBasis: "50%",
    minHeight: "20rem"
}))

const Curriculum = () => {

    const curriculum = useAppSelector((state) => state.data.curriculum)
    const dispatch = useAppDispatch()

    return (
        <CurriculumContainer>
            {curriculum.semesters.map((s, index) => (
                <SemesterWrapper key={index}>
                    <Semester semester={s} index={index}/>
                </SemesterWrapper>
            ))}
            <StyledButton onClick={() => dispatch(addSemester({}))}>Semester hinzufügen</StyledButton>
        </CurriculumContainer>
    )
}

export default Curriculum
