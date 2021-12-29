import React from "react";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "../../redux/hooks";
import ProgressSemester from "./progressSemester";
import { Box, Tab, Tabs } from "@mui/material";
import { getSemesterName } from "../../redux/data/data.reducer";

const SemesterWrapper = styled("div")(() => ({
  flexBasis: "50%",
  minHeight: "20rem",
  height: "calc(100% - 5rem)",
  padding: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexGrow: 1,
  // overflow: "auto",
  "> *": {
    flexGrow: 1,
  },
}));

const StyledTabs = styled(Tabs)(() => ({
  margin: "0 auto",
  "& .MuiTabs-flexContainer": {
    justifyContent: "center",
    alignItems: "center",
  },
}));

const ProgressPage = () => {
  const curriculum = useAppSelector((state) => state.data.curriculum);

  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const startSemesterIndex = useAppSelector(
    (state) => state.data.startSemesterIndex
  );

  return (
    <Box sx={{ height: "100%" }}>
      <StyledTabs
        centered
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label={"Übersicht"} />
        {curriculum.semesters.map((s, index) => {
          return <Tab label={getSemesterName(index, startSemesterIndex)} />;
        })}
      </StyledTabs>

      {value === 0 ? (
        <SemesterWrapper>
          <ProgressSemester />
        </SemesterWrapper>
      ) : (
        curriculum.semesters.map((s, index) => {
          if (index + 1 === value)
            return (
              <SemesterWrapper key={index}>
                <ProgressSemester index={index} />
              </SemesterWrapper>
            );
          else return null;
        })
      )}
    </Box>
  );
};
export default ProgressPage;
