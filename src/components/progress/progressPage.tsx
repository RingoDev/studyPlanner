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
  scrollSnapAlign: "start",
  overflowY: "auto",
  overscrollBehaviorY: "contain",
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

const StyledSection = styled("section")(() => ({
  overflow: "auto hidden",
  overscrollBehaviorX: "contain",
  scrollSnapType: "x mandatory",
  blockSize: "100%",
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "100%",
  height: "calc(100% - 48px)",

  "@media (prefers-reduced-motion: no-preference)": {
    scrollBehavior: "smooth",
  },

  "@media (hover: none)": {
    scrollbarWidth: "none",
  },

  "&::-webkit-scrollbar": {
    width: 0,
    height: 0,
  },
}));

const ProgressPage = () => {
  const curriculum = useAppSelector((state) => state.data.curriculum);

  const startSemesterIndex = useAppSelector(
    (state) => state.data.startSemesterIndex
  );

  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <StyledTabs
        onChange={handleChange}
        value={value}
        centered
        scrollButtons="auto"
      >
        <Tab component={"a"} href={"#tab-0"} label={"Übersicht"} />
        {curriculum.semesters.map((s, index) => {
          return (
            <Tab
              component={"a"}
              href={`#tab-${index + 1}`}
              key={index}
              label={getSemesterName(index, startSemesterIndex)}
            />
          );
        })}
      </StyledTabs>

      <StyledSection>
        <SemesterWrapper id={"tab-0"}>
          <ProgressSemester />
        </SemesterWrapper>
        {curriculum.semesters.map((s, index) => (
          <SemesterWrapper id={`tab-${index + 1}`} key={index + 1}>
            <ProgressSemester index={index} />
          </SemesterWrapper>
        ))}
      </StyledSection>
    </Box>
  );
};
export default ProgressPage;
