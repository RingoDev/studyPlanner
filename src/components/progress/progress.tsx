import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "../../redux/hooks";
import ProgressSection from "./progress-section";
import NavigationTabs from "./navigation-tabs";

const ProgressWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  maxWidth: "1636px",
  margin: "auto",
  [theme.breakpoints.up("md")]: {},
}));

const SectionWrapper = styled("div")(() => ({
  flexBasis: "50%",
  minHeight: "20rem",
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

const ScrollContainer = styled("section")(() => ({
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

const Progress = () => {
  const curriculum = useAppSelector((state) => state.data.curriculum);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ProgressWrapper>
      <NavigationTabs containerRef={containerRef} />
      <ScrollContainer ref={containerRef}>
        <SectionWrapper>
          <ProgressSection />
        </SectionWrapper>
        {curriculum.semesters.map((s, index) => {
          if (s.courses.length === 0) {
            return null;
          }
          return (
            <SectionWrapper key={s.name}>
              <ProgressSection semesterIndex={index} />
            </SectionWrapper>
          );
        })}
      </ScrollContainer>
    </ProgressWrapper>
  );
};
export default Progress;
