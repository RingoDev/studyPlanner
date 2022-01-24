import { styled } from "@mui/material/styles";
import GradesDoughnut from "../charts/grades-doughnut";
import FinishedDoughnut from "../charts/finished-doughnut";
import DashboardTile from "./dashboard-tile";

interface Props {
  semesterIndex?: number;
}

const StatisticsContainer = styled("div")(({ theme }) => ({
  padding: "0 2rem",
  // maxHeight: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",

  [theme.breakpoints.up("md")]: {
    // backgroundColor: "red",
    "& > *": {
      width: "100%",
      flexBasis: "100%",
      position: "relative",
    },
  },

  [theme.breakpoints.up("lg")]: {
    // backgroundColor: "blue",
    "& > *": {
      width: "50%",
      flexBasis: "50%",
      position: "relative",
    },
  },
}));

const Dashboard = ({ semesterIndex }: Props) => {
  return (
    <StatisticsContainer>
      {/*<DashboardTile semesterIndex={semesterIndex} Component={GradesDoughnut} />*/}
      {/*<DashboardTile*/}
      {/*  semesterIndex={semesterIndex}*/}
      {/*  Component={FinishedDoughnut}*/}
      {/*/>*/}
      <DashboardTile semesterIndex={semesterIndex} Component={GradesDoughnut} />
      <DashboardTile
        semesterIndex={semesterIndex}
        Component={FinishedDoughnut}
      />
    </StatisticsContainer>
  );
};

export default Dashboard;
