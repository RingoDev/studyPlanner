import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "../../redux/hooks";
import ProgressSemester from "./progressSemester";
import { Box } from "@mui/material";
import NavigationTabs from "./navigationTabs";

const SemesterWrapper = styled("div")(() => ({
  flexBasis: "50%",
  minHeight: "20rem",
  // height: "calc(100% - 5rem)",
  // padding: "1rem",
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

  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ height: "100%" }}>
      <NavigationTabs containerRef={sectionRef} />

      <StyledSection ref={sectionRef}>
        <SemesterWrapper>
          <ProgressSemester />
        </SemesterWrapper>
        {curriculum.semesters.map((s, index, array) => (
          <SemesterWrapper key={index + 1}>
            <ProgressSemester index={array.length - index - 1} />
          </SemesterWrapper>
        ))}
      </StyledSection>
    </Box>
  );
};
export default ProgressPage;
