import {createStyles, FormControl, makeStyles, MenuItem, Select, Typography} from "@material-ui/core";
import React from "react";

interface Props {
    semester: "WS" | "SS",
    setSemester: (semester: "SS" | "WS") => void
}

const useStyles = makeStyles(() =>
    createStyles({
        input: {
            marginLeft: "0.75rem",
            color: "#ffffff"
        }
    }),
);

const SelectSemester = ({semester, setSemester}: Props) => {
    const classes = useStyles()
    return (
        <>
            <Typography>Start with </Typography>
            <FormControl >
                <Select
                    className={classes.input}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as "SS" | "WS")}
                >
                    <MenuItem value={"WS"}>WS</MenuItem>
                    <MenuItem value={"SS"}><Typography>SS</Typography></MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default SelectSemester