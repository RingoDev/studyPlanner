import {ListItemIcon, Tooltip, Typography, withStyles} from "@material-ui/core";
import {AlertCircle, XCircle} from "lucide-react";
import React from "react";
import Course from "../types";

const ConstraintIndicator = ({course}: { course: Course }) => {

    const HtmlTooltip = withStyles(() => ({
        arrow: {
            color: '#f5f5f9',
        },
        tooltip: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: "20rem",
            fontSize: "1rem",
            border: '1px solid #dadde9',
        },
    }))(Tooltip);

    if (!course.violations || course.violations.length === 0) return <></>


    return (
        <ListItemIcon>
            <HtmlTooltip arrow title={
                <>
                    {course.violations.map((v, index) => {
                        return (
                            <Typography key={index}>{v.reason}</Typography>
                        )
                    })}
                </>
            }>
                {
                    course.violations.findIndex(v => v.severity === "HIGH") === -1 ?
                        <AlertCircle color={"red"}/> :
                        <XCircle color={"red"}/>
                }
            </HtmlTooltip>
        </ListItemIcon>
    )
}

export default ConstraintIndicator