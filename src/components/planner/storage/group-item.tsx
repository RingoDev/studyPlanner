import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Box,
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { Group } from "../../../types/types";
import { useAppSelector } from "../../../redux/hooks";
import { getCoursesFromGroups, getGroupWithIdFromGroups } from "../../../data";
import { COURSE_GROUP } from "../../../types/dndTypes";
import GroupListCollapsable from "./group-list-collapsable";
import { styled } from "@mui/material/styles";
import Color from "color";
import MarkedSearchText from "../marked-search-text";

interface Props {
  group: Group;
  index: number;
  level: number;
}

const StyledListIcon = styled(ListItemIcon)(() => ({
  minWidth: "36px",
  flexDirection: "column",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const GroupItem = ({ group, level }: Props) => {
  const groups = useAppSelector((state) => state.data.initialConfig.storage);
  const xOutOfYConstraints = useAppSelector(
    (state) => state.data.initialConfig.constraints.xOutOfYConstraints
  );

  const searchText = useAppSelector((state) => state.data.searchText);

  const [open, setOpen] = useState(false);

  const groupWithSameId = getGroupWithIdFromGroups(groups, group.id);
  const allGroupCourses =
    groupWithSameId !== undefined
      ? getCoursesFromGroups([groupWithSameId])
      : [];
  const getMaxCourses = allGroupCourses.length;

  const unbookedEcts = getCoursesFromGroups([group])
    .map((c) => c.ects)
    .reduce((e1, e2) => e1 + e2, 0);

  const allEcts = allGroupCourses
    .map((c) => c.ects)
    .reduce((e1, e2) => e1 + e2, 0);

  const maxEcts =
    xOutOfYConstraints.find((c) => c.group === group.id)?.maxEcts || allEcts;

  // console.log(`all ects: ${allEcts} for group: ${groupWithSameId?.title}`)
  // console.log("max ects: " + maxEcts + " for group: " + groupWithSameId?.title)
  // console.log("unbooked ects: " + unbookedEcts + " for group: " + groupWithSameId?.title)

  const ectsThresholdReached = allEcts - unbookedEcts >= maxEcts;

  const StyledListItem = styled(ListItem)(() => ({
    backgroundColor: ectsThresholdReached ? "#cccccc" : group.color,
    marginBottom: "0.375rem",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: ectsThresholdReached
        ? "#cccccc"
        : Color(group.color).alpha(0.8).string(),
    },
  }));

  return (
    <Box sx={{ padding: 0.25 / 4 ** level + "rem 0.5rem", maxWidth: "20rem" }}>
      <StyledListItem onClick={() => setOpen(!open)}>
        <ListItemText>
          <MarkedSearchText searchText={searchText} text={group.title} />
        </ListItemText>
        <StyledListIcon>
          {group.type === COURSE_GROUP
            ? group.courses.length
            : getCoursesFromGroups([group]).length}
          /{getMaxCourses}
        </StyledListIcon>
        <StyledListIcon>
          {open ? <ChevronUp /> : <ChevronDown />}
        </StyledListIcon>
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <GroupListCollapsable
          group={group}
          level={level}
          fullyBooked={ectsThresholdReached}
        />
      </Collapse>
    </Box>
  );
};

export default GroupItem;
