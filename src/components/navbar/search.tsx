import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSearchText } from "../../redux/data/data.actions";

const useBetterPerformanceSearch = false;

const Search = () => {
  const dispatch = useAppDispatch();
  const searchText = useAppSelector((state) => state.data.searchText);

  const [internSearchText, setInternSearchText] = useState<string>();
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInternSearchText(e.target.value as string);

    if (useBetterPerformanceSearch) {
      if ((e.target.value as string).trim().length >= 3) {
        dispatch(setSearchText({ text: e.target.value as string }));
      } else if (searchText.length !== 0) {
        // if global search text is already empty -> don't set
        dispatch(setSearchText({ text: "" }));
      }
    } else dispatch(setSearchText({ text: "" }));
  };

  return (
    <TextField
      onChange={handleChange}
      value={internSearchText}
      label="Suche"
      variant="filled"
    />
  );
};

export default Search;
