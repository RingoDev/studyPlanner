import {createStyles, ListItemIcon, makeStyles, Tooltip, Typography, withStyles} from "@material-ui/core";
import {AlertCircle, XCircle} from "lucide-react";
import React from "react";
import Course from "../types/types";

const useStyles = makeStyles(() => {
    return createStyles({
        icon: {
            display: "flex",
            justifyContent: "center"
        }
    })
})

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

    const classes = useStyles()

    if (!course.violations || course.violations.length === 0) return <></>

    let violations = course.violations;
    const highViolations = violations.filter(v => v.severity === "HIGH")
    if (highViolations.length > 0) violations = highViolations

    return (
        <ListItemIcon className={classes.icon}>
            <HtmlTooltip arrow title={
                <>
                    {violations.map((v, index) => {
                        if (typeof v.reason === "string") return <Typography key={index}>{v.reason}</Typography>
                        return (
                            <div key={index}>
                                {v.reason.map((r,innerIndex) => <Typography key={innerIndex}>{r}</Typography>)}
                            </div>
                        )
                    })}
                </>
            }>
                {
                    violations.findIndex(v => v.severity === "HIGH") === -1 ?
                        <AlertCircle color={"orange"}/> :
                        <XCircle color={"red"}/>
                }
            </HtmlTooltip>
        </ListItemIcon>
    )
}

export default ConstraintIndicator