import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { setStartSemester } from "../../redux/data/data.actions";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const SelectStartSemester = () => {
  const semesterList = useAppSelector((state) => state.data.selectSemesterList);
  const startSemester = useAppSelector((state) => state.data.startSemester);

  const dispatch = useAppDispatch();

  const getIndexOfStartInList = () => {
    const index = semesterList.findIndex(
      (s) => s.year === startSemester.year && s.isWS === startSemester.isWS
    );
    if (index === -1) return 0;
    return index;
  };

  return (
    <Box>
      <Typography align={"center"}>Start des Studiums:</Typography>
      <FormControl>
        <Select
          value={getIndexOfStartInList()}
          onChange={(e) =>
            dispatch(
              setStartSemester({
                startSemesterInfo: semesterList[e.target.value as number],
              })
            )
          }
        >
          {semesterList.map((n, index) => (
            <MenuItem key={(n.isWS ? "WS" : "SS") + n.year} value={index}>
              {(n.isWS ? "WS" : "SS") + n.year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectStartSemester;
