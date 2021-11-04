import React from "react";
import {SemesterType} from "./types/types";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {Button, createStyles, makeStyles} from "@material-ui/core";
import {removeSemester} from "./redux/data/data.actions";
import SemesterName from "./components/semesterName";
import DroppableCourseList from "./components/droppableCourseList";


const useStyles = makeStyles(() =>
    createStyles({
        container: {
            padding: "2rem"
        },
        semester: {

            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            borderRadius: "1rem",

            border: "1px solid rgba( 255, 255, 255, 0.18 )",
        },
        test: {
            position: "relative",
            padding: "3rem 1rem 1rem 1rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "rgba( 255, 255, 255, 0.5 )",
        }
    }),
)


const Semester = ({semester, index}: { semester: SemesterType, index: number }) => {

    const customECTsCounter = useAppSelector((state) => state.data.curriculum.semesters[index].customEcts)

    const classes = useStyles()

    const dispatch = useAppDispatch()
    return (
        <div className={classes.test}>
            <SemesterName index={index}/>
            <div style={{ paddingLeft: "4rem", height: "100%"}}>
                <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
                    <DroppableCourseList semester={semester} index={index}/>
                    <div style={{textAlign: "center", fontSize: "1.75rem"}}>
                        {customECTsCounter + semester.courses.reduce(((prev, course) => prev + course.ects), 0)} ECTs
                    </div>
                    <Button style={{zIndex: 2}}
                            onClick={() => dispatch(removeSemester({semesterIndex: index}))}>Semester entfernen</Button>
                </div>
            </div>
        </div>
    )
}

export default Semester