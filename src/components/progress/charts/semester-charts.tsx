import { Box } from "@mui/material";
import GradesDoughnut from "./grades-doughnut";
import FinishedDoughnut from "./finished-doughnut";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  semesterIndex?: number;
}

const StatisticsContainer = styled("div")(() => ({
  padding: "2rem",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& > *": {
    position: "relative",
    padding: "2rem",
  },
}));

const SemesterCharts = ({ semesterIndex }: Props) => {
  const courses = useAppSelector((state) =>
    semesterIndex === undefined
      ? state.data.curriculum.semesters.flatMap((s) => s.courses)
      : state.data.curriculum.semesters[semesterIndex].courses
  );

  // no course has a grade set
  if (courses.findIndex((c) => c.grade !== 0 && c.grade !== undefined) === -1) {
    return <StatisticsContainer />;
  }
  return (
    <StatisticsContainer>
      <Box>
        <GradesDoughnut semesterIndex={semesterIndex} />
      </Box>
      <Box>
        <FinishedDoughnut semesterIndex={semesterIndex} />
      </Box>
    </StatisticsContainer>
  );
};

export default SemesterCharts;
