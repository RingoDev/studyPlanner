import { Doughnut } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { useAppSelector } from "../../../redux/hooks";
import Course from "../../../types/types";

interface Props {
  semesterIndex: number | undefined;
}

const GradesDoughnut = ({ semesterIndex }: Props) => {
  const curriculum = useAppSelector((state) => state.data.curriculum);
  const gradesWeightedByEctsData = (): ChartData<
    "doughnut",
    number[],
    string
  > => {
    const labels: string[] = ["Sehr gut", "Gut", "Befriedigend", "Genügend"];
    const data: number[] = [0, 0, 0, 0];
    const backgroundColor: string[] = [];

    let courses: Course[];
    if (semesterIndex !== undefined) {
      courses = curriculum.semesters[semesterIndex].courses;
    } else {
      courses = curriculum.semesters.flatMap((s) => s.courses);
    }
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

  const chartOptions: ChartOptions<"doughnut"> = {
    // maintainAspectRatio: false,
    plugins: {
      legend: { labels: { boxWidth: 20, color: "#dddddd" } },
    },
  };

  return <Doughnut options={chartOptions} data={gradesWeightedByEctsData} />;
};

export default GradesDoughnut;
