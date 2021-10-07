import {Tooltip, withStyles} from "@material-ui/core";
import React from "react";
import {useAppSelector} from "../redux/hooks";
import {Check} from "lucide-react";

// const HtmlTooltip = withStyles(() => ({
//     arrow: {
//         color: '#f5f5f9',
//     },
//     tooltip: {
//         backgroundColor: '#f5f5f9',
//         color: 'rgba(0, 0, 0, 0.87)',
//         maxWidth: "20rem",
//         fontSize: "1rem",
//         border: '1px solid #dadde9',
//     },
// }))(Tooltip);

const SemesterName = ({index}:{index:number}) => {
    const semesterName: string = useAppSelector((state) => (state.data.selectSemesterList[state.data.startSemesterIndex + index]))
    const semesterIsDone: boolean = useAppSelector((state) => (state.data.currentSemesterIndex - state.data.startSemesterIndex) > index)

    return (
        <>
            {/*<HtmlTooltip title={semesterName} arrow placement={"top"}>*/}
                <div style={{
                    zIndex:2,
                    fontSize: "2.25rem",
                    position: "absolute",
                    top: "12rem",
                    minWidth:"20rem",
                    left: "-6.5rem",
                    transform: "rotate(270deg)",
                    textAlign:"right"
                }}>
                    {semesterIsDone ? <Check/>:null}
                    {/*Semester {index + 1}*/}
                    {semesterName}
                </div>
            {/*</HtmlTooltip>*/}
        </>
    )
}

export  default SemesterName