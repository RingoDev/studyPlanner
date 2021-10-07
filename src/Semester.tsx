import {Droppable} from "react-beautiful-dnd";
import React from "react";
import CourseList from "./components/courseList";
import {SemesterType} from "./types";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {Button, createStyles, makeStyles} from "@material-ui/core";
import {removeSemester} from "./redux/data/data.actions";
import SemesterName from "./components/semesterName";


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
        test:{
            position: "relative",
            padding: "3rem 1rem 3rem 1rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "rgba( 255, 255, 255, 0.5 )",
            // backdropFilter: "blur(20px)",
        }
    }),
)


const Semester = ({semester, index}: { semester: SemesterType, index: number }) => {

    const customECTsCounter = useAppSelector((state) => state.data.curriculum.semesters[index].customEcts)
    const semesterIsDone: boolean = useAppSelector((state) => (state.data.currentSemesterIndex - state.data.startSemesterIndex) > index)


    const classes = useStyles()

    const dispatch = useAppDispatch()
    return (
        <div className={classes.test}>
           <SemesterName index={index}/>
            <div style={{position: "relative", paddingLeft: "4rem", height: "100%"}}>
                <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
                    <Droppable droppableId={"sem" + index}>
                        {(provided) => (
                            <div style={{
                                border: semester.dropColor ? "2px solid " + semester.dropColor : "2px solid black",
                                height: "100%"
                            }}  {...provided.droppableProps}
                                 ref={provided.innerRef}>
                                <CourseList outerProvided={provided} courses={semester.courses} id={"sem" + index}/>
                            </div>
                        )}
                    </Droppable>
                    <div style={{textAlign: "center", fontSize: "1.75rem"}}>
                        {customECTsCounter + semester.courses.reduce(((prev, course) => prev + course.ects), 0)} ECTs
                    </div>
                    <Button style={{zIndex: 2}}
                            onClick={() => dispatch(removeSemester({semesterIndex: index}))}>Remove</Button>
                    {/*{semesterIsDone ? "done" : "not done"}*/}
                </div>
            </div>
        </div>
    )
}

export default Semester