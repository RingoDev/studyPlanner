import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setSearchText } from "../../redux/data/data.actions";

const Search = () => {
    const dispatch = useAppDispatch();

    const [internalText, setInternalText] = useState<string>("");

    // sets the global search text if the user is not typing for 250ms
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        console.log(`I can see you're not typing. I can set the global search text now!`);
        dispatch(setSearchText({ text: internalText }));
      }, 250);
      return () => clearTimeout(timeoutId);
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setInternalText(e.target.value as string);

    return (
      <TextField
        color={"secondary"}
        size={"small"}
        fullWidth
        onChange={handleChange}
        value={internalText}
        label="Suche"
        variant="filled"
      />
    );
  }
;

export default Search;
