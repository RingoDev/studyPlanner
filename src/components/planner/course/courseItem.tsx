import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import KusssLink from "./kusssLink";
import Course from "../../../types/types";
import ConstraintIndicator from "./constraintIndicator";
import CourseStateOption from "./courseStateOption";
import {Box} from "@mui/material";
import {styled} from "@mui/material/styles";

const CourseItem = ({course, isInStorage}: { course: Course, isInStorage: boolean }) => {

    const StyledListItem = styled(ListItem)(() => ({
        // backgroundColor: course.grade ? Color(course.color).alpha(0.3).string() : course.color,
        backgroundColor: course.color,
        padding: "0.5rem"
    }))

    return (
        <Box sx={{padding: "0 0.5rem 0.375rem 0.5rem"}}>
            <StyledListItem>
                <ListItemText>
                    {course.kusssId !== ""
                        ? <KusssLink id={course.kusssId}>{course.sign + " - " + course.title}</KusssLink>
                        : (course.sign + " - " + course.title)}
                </ListItemText>
                {isInStorage ?
                    null :
                    <>
                        <ConstraintIndicator course={course}/>
                        <CourseStateOption course={course}/>
                    </>
                }
            </StyledListItem>
        </Box>
    )
}
export default CourseItem
