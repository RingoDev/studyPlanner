import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { setExampleCurriculum } from "../../redux/data/data.actions";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const SelectExamplePlan = () => {
  const lastChosenExample = useAppSelector(
    (state) => state.data.lastChosenExample
  );
  const examples = useAppSelector((state) => state.data.initialConfig.examples);

  const dispatch = useAppDispatch();

  return (
    <Box>
      <Typography align={"center"}>Plan auswählen:</Typography>
      <FormControl>
        <Select
          value={lastChosenExample}
          onChange={(e) => {
            dispatch(
              setExampleCurriculum({
                exampleIndex: Number(e.target.value),
              })
            );
          }}
        >
          {examples.map((e, index) => (
            <MenuItem
              key={(e.startsWithWS ? "WS" : "SS") + "-" + e.name}
              value={index}
            >
              {`${e.name} - ${e.startsWithWS ? "WS" : "SS"}`}
            </MenuItem>
          ))}
          <MenuItem value={-1}>Selbst zusammenstellen</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectExamplePlan;
