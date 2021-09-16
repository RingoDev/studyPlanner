import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Button, createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {setCustomStudies} from "../redux/data/data.actions";


const useStyles = makeStyles(() =>
    createStyles({
        item: {
            backgroundColor: "#bbbbbb",
            marginBottom: "0.5rem"
        }
    }),
);

interface Props {
    semesterIndex: number,
}

const CustomStudies = ({semesterIndex}: Props) => {

    const dispatch = useAppDispatch()
    const counter = useAppSelector((state) => state.data.curriculum.semesters[semesterIndex].customEcts)

    const classes = useStyles()

    return (
        <ListItem
            className={classes.item}>
            <ListItemText>
                Freie Studienleistungen
            </ListItemText>

            <Button onClick={() => dispatch(setCustomStudies({
                semesterIndex: semesterIndex,
                ects: Math.max(counter - 1, 0)
            }))}>-</Button>
            <ListItemText>
                {counter} ECTs
            </ListItemText>
            <Button
                onClick={() => dispatch(setCustomStudies({semesterIndex: semesterIndex, ects: counter + 1}))}>+</Button>
        </ListItem>
    )
}

export default CustomStudies