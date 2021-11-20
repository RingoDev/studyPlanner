import React from "react";
import {useAppSelector} from "../../redux/hooks";

const SemesterName = ({index}: { index: number }) => {
    const semesterName: string = useAppSelector((state) => (state.data.selectSemesterList[state.data.startSemesterIndex + index]))
    // const semesterIsDone: boolean = useAppSelector((state) => (state.data.currentSemesterIndex - state.data.startSemesterIndex) > index)

    return (
        <>
            <div style={{
                zIndex: 2,
                fontSize: "2.25rem",
                position: "absolute",
                top: "12rem",
                minWidth: "20rem",
                left: "-6.5rem",
                transform: "rotate(270deg)",
                textAlign: "right"
            }}>
                {/*{semesterIsDone ? <Check/> : null}*/}
                {semesterName}
            </div>
        </>
    )
}

export default SemesterName
