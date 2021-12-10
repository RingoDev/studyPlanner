import React from "react";
import {SemesterType} from "../../types/types";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Button, Typography} from "@mui/material";
import {removeSemester} from "../../redux/data/data.actions";
import SemesterName from "./semesterName";
import DroppableCourseList from "./droppableCourseList";
import {styled} from "@mui/material/styles";

const SemesterContainer = styled("div")(() => ({
    position: "relative",
    padding: "3rem 1rem 1rem 1rem",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "rgba( 255, 255, 255, 0.5 )",
}))

const ListContainer = styled("div")(() => ({
    paddingLeft: "4rem",
    height: "100%",
    display: "flex",
    flexDirection: "column"
}))

const Semester = ({semester, index}: { semester: SemesterType, index: number }) => {

    const customECTsCounter = useAppSelector((state) => state.data.curriculum.semesters[index].customEcts)

    const dispatch = useAppDispatch()
    return (
        <SemesterContainer>
            <SemesterName index={index}/>
            <ListContainer>
                <DroppableCourseList semester={semester} index={index}/>
                <Typography align={"center"} fontSize={"1.75rem"}>
                    {customECTsCounter + semester.courses.reduce(((prev, course) => prev + course.ects), 0)} ECTS
                </Typography>
                <Button style={{zIndex: 2}} onClick={() => dispatch(removeSemester({semesterIndex: index}))}>
                    Semester entfernen
                </Button>
            </ListContainer>
        </SemesterContainer>
    )
}

export default Semester
