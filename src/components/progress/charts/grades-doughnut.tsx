import { Doughnut } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { useAppSelector } from "../../../redux/hooks";
import { Box } from "@mui/material";

interface Props {
  semesterIndex?: number;
}

const GradesDoughnut = ({ semesterIndex }: Props) => {
  const courses = useAppSelector((state) =>
    semesterIndex === undefined
      ? state.data.curriculum.semesters.flatMap((s) => s.courses)
      : state.data.curriculum.semesters[semesterIndex].courses
  );
  const gradesWeightedByEctsData = (): ChartData<
    "doughnut",
    number[],
    string
  > => {
    const labels: string[] = ["Sehr gut", "Gut", "Befriedigend", "Genügend"];
    const data: number[] = [0, 0, 0, 0];
    const backgroundColor: string[] = [];

    courses.forEach((c) =>
      c.grade !== undefined && c.grade !== 0
        ? (data[c.grade - 1] = data[c.grade - 1] + c.ects)
        : null
    );

    backgroundColor.push("#70e899", "#abd26d", "#ceb85b", "#e29f62");
    // backgroundColor.push("#aaaaaa", "#bbbbbb", "#cccccc", "#dddddd");

    if (data.every((n) => n === 0)) {
      return {
        labels: [],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#00000000"],
            // borderColor: ["#00000000"],
          },
        ],
      };
    }

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor,
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

  const getAverageGrade = () => {
    const grades = courses
      .map((c) => c.grade)
      .filter((grade) => grade !== undefined && grade !== 0) as number[];
    const average = grades.reduce((e1, e2) => e1 + e2, 0) / grades.length;

    return `${Math.round(average * 100) / 100}`;
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    elements: {
      // @ts-ignore
      center: {
        text: getAverageGrade(),
        color: "#000000", // Default is #000000
        fontStyle: "Arial", // Default is Arial
        sidePadding: 40, // Default is 20 (as a percentage)
        minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
        lineHeight: 25, // Default is 25 (in px), used for when text wraps
      },
    },
    // maintainAspectRatio: false,
    plugins: {
      legend: { labels: { boxWidth: 20, color: "#000000" }, position: "right" },
    },
  };

  return <Doughnut options={chartOptions} data={gradesWeightedByEctsData} />;
};

export default GradesDoughnut;
