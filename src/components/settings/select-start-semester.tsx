import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { setStartSemester } from "../../redux/data/data.actions";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const SelectStartSemester = () => {
  const semesterList = useAppSelector((state) => state.data.selectSemesterList);
  const startSemesterIndex = useAppSelector(
    (state) => state.data.startSemesterIndex
  );

  const dispatch = useAppDispatch();

  return (
    <Box>
      <Typography align={"center"}>Start des Studiums:</Typography>
      <FormControl>
        <Select
          value={startSemesterIndex}
          onChange={(e) =>
            dispatch(
              setStartSemester({
                startSemesterIndex: e.target.value as number,
              })
            )
          }
        >
          {semesterList.map((n, index) => (
            <MenuItem key={n} value={index}>
              {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectStartSemester;
