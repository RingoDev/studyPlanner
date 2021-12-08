import {X} from "lucide-react";
import {Button, Fade, FormControl, Grid, MenuItem, Modal, Select, Typography} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {setExampleCurriculum, setStartSemester} from "../../redux/data/data.actions";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            padding: "2rem"
        },
        box: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            padding: "2rem",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            borderRadius: "1rem",
            minHeight: "50rem",
            background: "rgba( 255, 255, 255, 0.5 )",
            border: "1px solid rgba( 255, 255, 255, 0.18 )",
            minWidth: "50rem"
        }
    }),
)

const ConfigurationModal = ({open, setOpen}: { open: boolean, setOpen: (open: boolean) => void }) => {


    const lastChosenExample = useAppSelector((state) => state.data.lastChosenExample)
    const examples = useAppSelector((state) => state.data.initialConfig.examples)
    const semesterList = useAppSelector((state) => state.data.selectSemesterList)
    const startSemesterIndex = useAppSelector((state) => state.data.startSemesterIndex)
    const dispatch = useAppDispatch()

    const classes = useStyles()
    return (
        <>
            <Modal
                open={open}
                onClose={() => {
                }}
                BackdropProps={{
                    timeout: 2000,
                }}
            >
                <Fade in={open}>
                    <div className={classes.box}>
                        <Button onClick={() => setOpen(!open)}>
                            <X color={"black"}/>
                        </Button>

                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent:"space-evenly", height:"100%"}}>
                            <Grid>
                                <Grid item>
                                    <Typography align={"center"}>Start Semester auswählen: </Typography>
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
                                    <Typography align={"center"}>Studium auswählen</Typography>
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

                            <Grid>
                                <Grid item>
                                    <Typography align={"center"}>Beispiel Plan auswählen:</Typography>
                                </Grid>
                                <Grid item>
                                    <FormControl>
                                        <Select
                                            value={lastChosenExample}
                                            onChange={(e) => {
                                                dispatch(setExampleCurriculum({exampleIndex: Number(e.target.value)}))
                                            }}>
                                            {examples.map((e, index) => (
                                                <MenuItem key={index}
                                                    value={index}>{e.name + " - " + e.startsWith}
                                                </MenuItem>
                                            ))}
                                            <MenuItem value={-1}>Selbst zusammenstellen</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Fade>
            </Modal>

        </>
    )
}

export default ConfigurationModal
