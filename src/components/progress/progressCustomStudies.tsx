import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { styled } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import { Box } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import HighlightSearchText from "../planner/HighlightSearch";

interface Props {
  semesterIndex: number;
}

const ProgressCustomStudies = ({ semesterIndex }: Props) => {
  // const ects = useAppSelector(
  //   (state) => state.data.curriculum.semesters[semesterIndex].customEcts
  // );
  const searchText = useAppSelector((state) => state.data.searchText);

  const StyledListItem = styled(ListItem)(() => ({
    backgroundColor: "#dddddd",
    padding: "0.5rem",
  }));

  return (
    <Box sx={{ padding: "0 0.5rem 0.375rem 0.5rem" }}>
      <StyledListItem>
        <ListItemText>
          <HighlightSearchText
            searchText={searchText}
            text={"Freie Studienleistungen"}
          />
        </ListItemText>
      </StyledListItem>
    </Box>
  );
};

export default ProgressCustomStudies;
