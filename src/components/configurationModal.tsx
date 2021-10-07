import {X} from "lucide-react";
import {
    Button,
    createStyles, Fade,
    FormControl,
    Grid,
    makeStyles,
    MenuItem,
    Modal,
    Select,
    Typography
} from "@material-ui/core";
import {setStartSemester} from "../redux/data/data.actions";
import React from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";

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
                    </div>
                    </Fade>
                </Modal>

        </>
    )
}

export default ConfigurationModal