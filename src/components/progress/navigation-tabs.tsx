import { Tab, Tabs } from "@mui/material";
import React, { RefObject, useEffect } from "react";
import { useAppSelector } from "../../lib/hooks/redux-hooks";
import { styled } from "@mui/material/styles";

const StyledTabs = styled(Tabs)(() => ({
  margin: "0 auto",
  "& .MuiTabs-flexContainer": {
    justifyContent: "center",
    alignItems: "center",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.secondary.light,
}));

interface Props {
  containerRef: RefObject<HTMLDivElement>;
}

const NavigationTabs = ({ containerRef }: Props) => {
  const nonEmptySemesters = useAppSelector(
    (state) => state.data.curriculum.semesters
  ).filter((s) => s.courses.length !== 0);

  const [value, setValue] = React.useState<number>(0);

  // scrolls to the section that belongs to the tab that is clicked on
  const scrollToSection = (event: React.SyntheticEvent, newValue: number) => {
    if (containerRef.current === null) return;
    const sectionWidth =
      containerRef.current.scrollWidth / (nonEmptySemesters.length + 1);
    containerRef.current?.scrollTo({ left: sectionWidth * newValue });
    setValue(newValue);
  };

  // add and remove scroll event listener
  useEffect(() => {
    // copying to correctly handle cleanup
    const myRef = containerRef.current;

    const handleEvent = () => {
      if (myRef === null) return;
      const sectionWidth = myRef.scrollWidth / (nonEmptySemesters.length + 1);
      if (myRef.scrollLeft % sectionWidth === 0) {
        // set navigation tabs to currently open tab
        const scrolledToTab = myRef.scrollLeft / sectionWidth;
        setValue(scrolledToTab);
      }
    };
    myRef?.addEventListener("scroll", handleEvent, {
      passive: true,
    });
    return () => {
      myRef?.removeEventListener("scroll", handleEvent);
    };
  }, [containerRef, nonEmptySemesters.length]);

  return (
    <StyledTabs
      onChange={scrollToSection}
      value={value}
      // centered
      scrollButtons="auto"
    >
      <StyledTab label={"Übersicht"} />
      {nonEmptySemesters.map((s) => {
        return <StyledTab key={s.name} label={s.name} />;
      })}
    </StyledTabs>
  );
};

export default NavigationTabs;
