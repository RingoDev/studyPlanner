import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setSearchText } from "../../redux/data/data.actions";

const Search = () => {
  const dispatch = useAppDispatch();

  const [internalText, setInternalText] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstLoad = useRef(true);

  // sets the global search text if the user is not typing for 250ms
  // does not fire on first load
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      dispatch(setSearchText({ text: internalText }));
    }, 250);
    return () => clearTimeout(timeoutId);
  });

  // adds a keydown listener to the document to catch all ctr + f actions
  // and redirects them to the search input
  useEffect(() => {
    const setFocus = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "f" || e.key === "F")) {
        inputRef.current?.focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", setFocus);
    return () => document.removeEventListener("keydown", setFocus);
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setInternalText(e.target.value as string);

  return (
    <TextField
      inputRef={inputRef}
      color={"secondary"}
      size={"small"}
      fullWidth
      onChange={handleChange}
      value={internalText}
      label="Suche"
      variant="filled"
    />
  );
};
export default Search;
