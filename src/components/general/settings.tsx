import {Box, FormControl, MenuItem, Select, Typography} from "@mui/material";
import {setExampleCurriculum, setStartSemester} from "../../redux/data/data.actions";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {styled} from "@mui/material/styles";

const Settings = () => {

    const lastChosenExample = useAppSelector((state) => state.data.lastChosenExample)
    const examples = useAppSelector((state) => state.data.initialConfig.examples)
    const semesterList = useAppSelector((state) => state.data.selectSemesterList)
    const startSemesterIndex = useAppSelector((state) => state.data.startSemesterIndex)
    const dispatch = useAppDispatch()


    const SettingsContainer = styled('div')(() => ({
        borderRadius: "2rem",
        padding: "2rem",
        backgroundColor: "#dddddd",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        "> div": {
            display: "flex",
            alignItems: "center"
        },
        "> div > *": {
            padding: "0.5rem",
        }
    }))

    return (
        <Box sx={{height: "100%", padding: "5rem",}}>
            <SettingsContainer>
                <Box>
                    <Typography align={"center"}>Studium:</Typography>
                    <FormControl>
                        <Select
                            value={0}
                            onChange={() => {
                            }}>
                            <MenuItem value={0}>Bachelorstudium Wirtschaftsinformatik</MenuItem>
                            <MenuItem value={1}>Masterstudium Wirtschaftsinformatik</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <Typography align={"center"}>Start des Studiums:</Typography>
                    <FormControl>
                        <Select
                            value={startSemesterIndex}
                            onChange={((e) => dispatch(setStartSemester({startSemesterIndex: e.target.value as number})))}>
                            {semesterList.map((n, index) => (
                                <MenuItem key={n} value={index}>{n}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <Typography align={"center"}>Plan auswählen:</Typography>
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
                </Box>
            </SettingsContainer>
        </Box>
    )
}

export default Settings
