import { Box } from "@mui/material";
import GradesDoughnut from "./grades-doughnut";
import FinishedDoughnut from "./finished-doughnut";
import { styled } from "@mui/material/styles";

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
