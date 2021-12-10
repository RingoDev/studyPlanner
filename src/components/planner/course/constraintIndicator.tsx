import {ListItemIcon, Tooltip, Typography} from "@mui/material";
import {AlertCircle, XCircle} from "lucide-react";
import React from "react";
import Course from "../../../types/types";
import {styled} from "@mui/material/styles";

const HtmlTooltip = styled(Tooltip)(() => ({
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
}));

const ConstraintIndicator = ({course}: { course: Course }) => {

    if (!course.violations || course.violations.length === 0) return <></>

    let violations = course.violations;
    const highViolations = violations.filter(v => v.severity === "HIGH")
    if (highViolations.length > 0) violations = highViolations

    return (
        <ListItemIcon sx={{display: "flex", justifyContent: "center"}}>
            <HtmlTooltip arrow title={
                <>
                    {violations.map((v, index) => {
                        if (typeof v.reason === "string") return <Typography key={index}>{v.reason}</Typography>
                        return (
                            <div key={index}>
                                {v.reason.map((r, innerIndex) => <Typography key={innerIndex}>{r}</Typography>)}
                            </div>
                        )
                    })}
                </>
            }>
                {violations.findIndex(v => v.severity === "HIGH") === -1
                    ? <AlertCircle color={"orange"}/>
                    : <XCircle color={"red"}/>
                }
            </HtmlTooltip>
        </ListItemIcon>
    )
}

export default ConstraintIndicator
