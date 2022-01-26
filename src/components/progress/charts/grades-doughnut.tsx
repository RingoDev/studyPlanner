import { Doughnut } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { useAppSelector } from "../../../redux/hooks";
import { Box } from "@mui/material";
import { courseMatchesSearch } from "../../../lib/search";
import Color from "color";

interface Props {
  semesterIndex?: number;
}

const GradesDoughnut = ({ semesterIndex }: Props) => {
  const unfilteredCourses = useAppSelector((state) =>
    semesterIndex === undefined
      ? state.data.curriculum.semesters.flatMap((s) => s.courses)
      : state.data.curriculum.semesters[semesterIndex].courses
  );
  const searchText = useAppSelector((state) => state.data.searchText);

  const courses = unfilteredCourses.filter((c) =>
    courseMatchesSearch(c, searchText)
  );

  const getColor = (input: number) => {
    const colors = ["#70e899", "#abd26d", "#ceb85b", "#e29f62"];

    const scaledInput = (input - 1) % colors.length;
    const rest = scaledInput % 1;

    return Color(colors[Math.floor(scaledInput)])
      .mix(Color(colors[Math.ceil(scaledInput)]), rest)
      .hex();
  };

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

    return Math.round(average * 100) / 100;
  };

  const grade = getAverageGrade();

  const chartOptions: ChartOptions<"doughnut"> = {
    elements: {
      // @ts-ignore
      center: {
        text: grade.toString(),
        color: getColor(grade), // Default is #000000
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

  return <Doughnut options={chartOptions} data={gradesWeightedByEctsData} />;
};

export default GradesDoughnut;
