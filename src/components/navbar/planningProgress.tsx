import { useAppSelector } from "../../redux/hooks";
import { Box } from "@mui/material";

const PlanningProgress = () => {
  const plannedEcts = useAppSelector((state) => state.data.curriculum.semesters)
    .map(
      (s) =>
        s.customEcts +
        s.courses.map((c) => c.ects).reduce((e1, e2) => e1 + e2, 0)
    )
    .reduce((e1, e2) => e1 + e2, 0);

  return <Box sx={{ minWidth: "4rem" }}>{plannedEcts}</Box>;
};
export default PlanningProgress;
