import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const FormBox = styled("div")(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  // [theme.breakpoints.down("sm")]: {
  //     padding:"0.5rem"
  // }
}));

const SelectStudies = () => {
  return (
    <FormBox>
      <Typography align={"center"}>Studium:</Typography>
      <FormControl>
        <Select value={0}>
          <MenuItem value={0}>Bachelorstudium Wirtschaftsinformatik</MenuItem>
          <MenuItem value={1}>Masterstudium Wirtschaftsinformatik</MenuItem>
        </Select>
      </FormControl>
    </FormBox>
  );
};

export default SelectStudies;
