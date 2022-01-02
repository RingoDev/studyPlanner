import { ChartData, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAppSelector } from "../../redux/hooks";

interface Props {
  semesterIndex: number | undefined;
}

const FinishedDoughnut = ({ semesterIndex }: Props) => {
  const curriculum = useAppSelector((state) => state.data.curriculum);
  const generateData = (): ChartData<"doughnut", number[], string> => {
    const labels: string[] = ["Abgeschlossen", "Offen"];
    const data: number[] = [];
    const backgroundColor: string[] = [];
    // const borderColor: string[] = [];
    // const hoverBackgroundColor: string[] = [];
    // const hoverBorderColor: string[] = [];

    if (semesterIndex !== undefined) {
      const finishedEcts = curriculum.semesters[semesterIndex].courses
        .filter((c) => c.grade !== undefined && c.grade !== 0)
        .map((c) => c.ects)
        .reduce((e1, e2) => e1 + e2, 0);

      const unfinishedEcts = curriculum.semesters[semesterIndex].courses
        .filter((c) => c.grade === undefined || c.grade === 0)
        .map((c) => c.ects)
        .reduce((e1, e2) => e1 + e2, 0);

      data.push(finishedEcts, unfinishedEcts);
    } else {
      const finishedEcts = curriculum.semesters
        .flatMap((s) => s.courses)
        .filter((c) => c.grade !== undefined && c.grade !== 0)
        .map((c) => c.ects)
        .reduce((e1, e2) => e1 + e2, 0);

      const unfinishedEcts = curriculum.semesters
        .flatMap((s) => s.courses)
        .filter((c) => c.grade === undefined || c.grade === 0)
        .map((c) => c.ects)
        .reduce((e1, e2) => e1 + e2, 0);

      data.push(finishedEcts, unfinishedEcts);
    }

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

  const chartOptions: ChartOptions<"doughnut"> = {
    // maintainAspectRatio: false,
    plugins: {
      legend: { labels: { boxWidth: 20, color: "#dddddd" } },
    },
  };

  return <Doughnut options={chartOptions} data={generateData} />;
};

export default FinishedDoughnut;
