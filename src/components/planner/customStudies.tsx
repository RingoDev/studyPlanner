import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Box, Button } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCustomStudies } from "../../redux/data/data.actions";
import { Minus, Plus } from "lucide-react";
import { styled } from "@mui/material/styles";

interface Props {
  semesterIndex: number;
}

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: "32px",
  color: theme.palette.text.primary,
}));

const StyledText = styled(ListItemText)(() => ({
  minWidth: "32px",
  textAlign: "center",
}));

const CustomStudies = ({ semesterIndex }: Props) => {
  const dispatch = useAppDispatch();
  const counter = useAppSelector(
    (state) => state.data.curriculum.semesters[semesterIndex].customEcts
  );

  return (
    <Box sx={{ padding: "0 0.5rem" }}>
      <ListItem
        sx={{
          backgroundColor: "#bbbbbb",
          marginBottom: "0.5rem",
        }}
      >
        <ListItemText>Freie Studienleistungen</ListItemText>
        <StyledButton
          onClick={() =>
            dispatch(
              setCustomStudies({
                semesterIndex,
                ects: Math.max(counter - 0.5, 0),
              })
            )
          }
        >
          <Minus size={16} />
        </StyledButton>
        <StyledText>{counter}</StyledText>
        <StyledButton
          onClick={() =>
            dispatch(
              setCustomStudies({
                semesterIndex,
                ects: counter + 0.5,
              })
            )
          }
        >
          <Plus size={16} />
        </StyledButton>
      </ListItem>
    </Box>
  );
};

export default CustomStudies;
