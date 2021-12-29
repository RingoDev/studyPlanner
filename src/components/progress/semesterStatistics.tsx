import { Box } from "@mui/material";
import GradesDoughnut from "./gradesDoughnut";
import FinishedDoughnut from "./finishedDoughnut";

interface Props {
  semesterIndex?: number;
}

const SemesterStatistics = ({ semesterIndex }: Props) => {
  return (
    <Box
      sx={{
        padding: "2rem",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ position: "relative", padding: "2rem" }}>
        <GradesDoughnut semesterIndex={semesterIndex} />
      </Box>
      <Box sx={{ position: "relative", padding: "2rem" }}>
        <FinishedDoughnut semesterIndex={semesterIndex} />
      </Box>
    </Box>
  );
};

export default SemesterStatistics;
