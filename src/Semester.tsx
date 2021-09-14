import { Droppable} from "react-beautiful-dnd";
import React from "react";
import {SemesterType} from "./App";
import CourseList from "./components/courseList";

const Semester = ({semester, index}: { semester: SemesterType, index: number }) => {

    return (
        <div style={{position: "relative", padding: "3rem 1rem 3rem 1rem", height: "100%"}}>
            <div style={{
                fontSize: "2.25rem",
                position: "absolute",
                top: "8rem",
                left: "-2rem",
                transform: "rotate(270deg)"
            }}>Semester {index + 1}</div>
            <div style={{position: "relative", paddingLeft: "4rem", height: "100%"}}>
                <Droppable droppableId={"sem" + index}>
                    {(provided) => (
                        <div style={{
                            border: semester.dropColor ? "5px dashed " + semester.dropColor : "1px solid black",
                            height: "100%"
                        }}  {...provided.droppableProps}
                             ref={provided.innerRef}>
                            <CourseList outerProvided={provided} courses={semester.courses}/>
                        </div>
                    )}
                </Droppable>
                {semester.courses.reduce(((prev, course) => prev + course.ects), 0)}
            </div>
        </div>
    )
}

export default Semester