import React from "react";
import {SemesterType} from "../../types/types";
import {Droppable} from "react-beautiful-dnd";
import List from "@mui/material/List";
import DraggableCourseItem from "./course/draggableCourseItem";
import CustomStudies from "./customStudies";
import {Box} from "@mui/material";


interface Props {
    semester: SemesterType
    index: number
}

const DroppableCourseList = ({semester, index}: Props) => (
    <Droppable droppableId={"sem" + index}>
        {provided => (
            <Box ref={provided.innerRef}
                 sx={{border: "2px solid #cccccc", height: "100%"}}
                 {...provided.droppableProps} >
                <List disablePadding sx={{paddingTop: "0.5rem",}}>
                    {semester.courses.map((c, index) =>
                        <DraggableCourseItem key={c.id} course={c} index={index} containerId={"sem" + index}/>
                    )}
                    {provided.placeholder}
                    <CustomStudies semesterIndex={index}/>
                </List>
            </Box>
        )}
    </Droppable>
)


export default DroppableCourseList
