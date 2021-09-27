import {Link} from "react-router-dom";
import {Container, createStyles, FormControl, Grid, makeStyles, MenuItem, Select, Typography} from "@material-ui/core";
import React from "react";
import {X} from "lucide-react";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {setStartSemester} from "./redux/data/data.actions";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            paddingTop: "2rem",
            backgroundColor: "#3f51b5",
            height: "100%"
        },
    }),
)

const Configuration = () => {

    const semesterList = useAppSelector((state) => state.data.selectSemesterList)
    const startSemesterIndex = useAppSelector((state) => state.data.startSemesterIndex)
    const dispatch = useAppDispatch()

    const classes = useStyles()


    return (
        <>
            <Container className={classes.root}>
                <Link to={"/"}>
                    <X color={"black"}/>
                </Link>

                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Grid>
                        <Grid item>
                            <Typography align={"center"}>Starting Semester: </Typography>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <Select
                                    value={startSemesterIndex}
                                    onChange={((e) => dispatch(setStartSemester({startSemesterIndex: e.target.value as number})))}>
                                    {semesterList.map((n, index) => (
                                        <MenuItem key={n} value={index}>{n}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Grid item>
                            <Typography align={"center"}>Select your studies: </Typography>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <Select
                                    value={0}
                                    onChange={() => {
                                    }}>
                                    <MenuItem value={0}>Bachelorstudium Wirtschaftsinformatik</MenuItem>
                                    <MenuItem value={1}>Masterstudium Wirtschaftsinformatik</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </>
    )
}

export default Configuration