import {createStyles, FormControl, makeStyles, MenuItem, Select, Typography} from "@material-ui/core";
import React from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {setStartSemester} from "../redux/data/data.actions";

const useStyles = makeStyles(() =>
    createStyles({
        input: {
            marginLeft: "0.75rem",
            color: "#ffffff"
        }
    }),
);

const SelectSemester = () => {

    const startSemester = useAppSelector((state) => state.data.startSemester)
    const dispatch = useAppDispatch()

    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown; }>) => {
        dispatch(setStartSemester(
            {startSemester: (e.target.value as "SS" | "WS")}
        ))
    }

    const classes = useStyles()
    return (
        <>
            <Typography>Start with </Typography>
            <FormControl>
                <Select
                    className={classes.input}
                    value={startSemester}
                    onChange={handleChange}
                >
                    <MenuItem value={"WS"}>WS</MenuItem>
                    <MenuItem value={"SS"}><Typography>SS</Typography></MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default SelectSemester