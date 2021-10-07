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
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

        },
        container: {
            padding: "4rem",
            backdropFilter: "blur(0px)",
            backgroundColor: "transparent",
            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            borderRadius: "1rem",
            minHeight: "50rem",
            background: "rgba( 255, 255, 255, 0.3 )",
            border: "1px solid rgba( 255, 255, 255, 0.18 )",
        }
    }),
)

const Configuration = () => {

    const semesterList = useAppSelector((state) => state.data.selectSemesterList)
    const startSemesterIndex = useAppSelector((state) => state.data.startSemesterIndex)
    const dispatch = useAppDispatch()

    const classes = useStyles()


    return (
        <>
            <div className={classes.root}>
                <Container className={classes.container}>
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
            </div>
        </>
    )
}

export default Configuration