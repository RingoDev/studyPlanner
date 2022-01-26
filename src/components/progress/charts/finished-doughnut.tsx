import { ChartData, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAppSelector } from "../../../redux/hooks";
import { Box } from "@mui/material";
import { courseMatchesSearch } from "../../../lib/search";

interface Props {
  semesterIndex?: number;
}

const FinishedDoughnut = ({ semesterIndex }: Props) => {
  const unfilteredCourses = useAppSelector((state) =>
    semesterIndex === undefined
      ? state.data.curriculum.semesters.flatMap((s) => s.courses)
      : state.data.curriculum.semesters[semesterIndex].courses
  );
  const searchText = useAppSelector((state) => state.data.searchText);

  const courses = unfilteredCourses.filter((c) =>
    courseMatchesSearch(c, searchText)
  );

  const generateData = (): ChartData<"doughnut", number[], string> => {
    const labels: string[] = ["Abgeschlossen", "Offen"];
    const data: number[] = [];
    const backgroundColor: string[] = [];

    const finishedEcts = courses
      .filter((c) => c.grade !== undefined && c.grade !== 0)
      .map((c) => c.ects)
      .reduce((e1, e2) => e1 + e2, 0);

    const unfinishedEcts = courses
      .filter((c) => c.grade === undefined || c.grade === 0)
      .map((c) => c.ects)
      .reduce((e1, e2) => e1 + e2, 0);

    data.push(finishedEcts, unfinishedEcts);

    if (data.every((n) => n === 0)) {
      return {
        labels: [],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#00000000"],
          },
        ],
      };
    }

    backgroundColor.push("#dddddd", "#aaaaaa");

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor,
          // borderColor: borderColor,
          // hoverBackgroundColor: hoverBackgroundColor,
          // hoverBorderColor: hoverBorderColor,
        },
      ],
    };
  };

  // no course has a grade set
  if (courses.findIndex((c) => c.grade !== 0 && c.grade !== undefined) === -1) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        Trage Noten ein um Statistiken anzuzeigen
      </Box>
    );
  }

  const getAverage = () => {
    const finishedEcts = courses
      .filter((c) => c.grade !== undefined && c.grade !== 0)
      .map((c) => c.ects)
      .reduce((e1, e2) => e1 + e2, 0);

    const unfinishedEcts = courses
      .filter((c) => c.grade === undefined || c.grade === 0)
      .map((c) => c.ects)
      .reduce((e1, e2) => e1 + e2, 0);

    return `${
      Math.round((finishedEcts / (finishedEcts + unfinishedEcts)) * 1000) / 10
    }%`;
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    elements: {
      // @ts-ignore
      center: {
        text: getAverage(),
        color: "#000000", // Default is #000000
        fontStyle: "Arial", // Default is Arial
        sidePadding: 30, // Default is 20 (as a percentage)
        minFontSize: 0, // Default is 20 (in px), set to false and text will not wrap.
        maxFontSize: 40,
        lineHeight: 25, // Default is 25 (in px), used for when text wraps
      },
    },
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        onClick: (e) => e.native?.stopPropagation(),
        labels: { boxWidth: 20, color: "#000000" },
        position: "right",
      },
    },
  };

  return <Doughnut options={chartOptions} data={generateData} />;
};

export default FinishedDoughnut;
