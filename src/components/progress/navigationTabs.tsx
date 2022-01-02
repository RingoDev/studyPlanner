import { Tab, Tabs } from "@mui/material";
import { getSemesterName } from "../../redux/data/data.reducer";
import React, { RefObject, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { styled } from "@mui/material/styles";

const StyledTabs = styled(Tabs)(({}) => ({
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
  const curriculum = useAppSelector((state) => state.data.curriculum);

  const startSemesterIndex = useAppSelector(
    (state) => state.data.startSemesterIndex
  );

  const [value, setValue] = React.useState<number>(0);

  const scrollToSection = (event: React.SyntheticEvent, newValue: number) => {
    if (containerRef.current === null) return;
    const sectionWidth =
      containerRef.current.scrollWidth / (curriculum.semesters.length + 1);
    containerRef.current?.scrollTo({ left: sectionWidth * newValue });
    setValue(newValue);
  };

  useEffect(() => {
    // copying to correctly handle cleanup
    const myRef = containerRef.current;

    const handleEvent = (e: HTMLElementEventMap["scroll"]) => {
      // console.log(e);

      if (myRef === null) return;
      const sectionWidth =
        myRef.scrollWidth / (curriculum.semesters.length + 1);
      if (myRef.scrollLeft % sectionWidth === 0) {
        // set navigation tabs to currently open tab
        const scrolledToTab = myRef.scrollLeft / sectionWidth;
        setValue(scrolledToTab);
      }
    };

    console.log("adding scroll listener");
    myRef?.addEventListener("scroll", handleEvent, {
      passive: true,
    });
    return () => {
      console.log("removing scroll listener");
      myRef?.removeEventListener("scroll", handleEvent);
    };
  }, [containerRef, curriculum.semesters.length]);

  return (
    <StyledTabs
      onChange={scrollToSection}
      value={value}
      centered
      scrollButtons="auto"
    >
      <StyledTab label={"Übersicht"} />
      {curriculum.semesters.map((s, index, array) => {
        return (
          <StyledTab
            key={index}
            label={getSemesterName(
              array.length - index - 1,
              startSemesterIndex
            )}
          />
        );
      })}
    </StyledTabs>
  );
};

export default NavigationTabs;
