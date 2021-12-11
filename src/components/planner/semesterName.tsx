import React from "react";
import {useAppSelector} from "../../redux/hooks";
import {getSemesterName} from "../../redux/data/data.reducer";
import {styled} from "@mui/material/styles";
import {Typography} from "@mui/material";

const VerticalBox = styled(Typography)(({theme}) => ({
    zIndex: 2,
    fontSize: "2.25rem",
    position: "absolute",
    top: "11.5rem",
    minWidth: "20rem",
    left: "-6.5rem",
    transform: "rotate(270deg)",
    textAlign: "right",
    [theme.breakpoints.down("md")]: {
        position: "relative",
        transform: "none",
        top: "0",
        left: "0",
        textAlign: "center",
    }
}))

const SemesterName = ({index}: { index: number }) => {

    const startSemesterIndex = useAppSelector((state) => (state.data.startSemesterIndex))
    const semesterName: string = getSemesterName(index, startSemesterIndex)

    return (
        <VerticalBox color={"primary"}>
            {semesterName}
        </VerticalBox>
    )
}

export default SemesterName
