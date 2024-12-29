import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";

const AttendanceChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: [
        "Nursery",
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
        "8th",
        "9th",
        "10th",
        "11th",
        "12th",
      ],
      datasets: [
        {
          label: "Present",
          data: [65, 59, 70, 31, 56, 55, 10, 23, 43, 23, 43, 65],
          fill: false,
          tension: 0.4,
          borderColor: "green",
        },
        {
          label: "Absent",
          data: [28, 48, 40, 19, 26, 27, 40, 43, 32, 23, 35, 32, 43],
          fill: false,
          tension: 0.4,
          borderColor: "#DB3525",
        },
        {
          label: "Late",
          data: [40, 50, 30, 60, 45, 34, 30, 50, 39, 23, 12, 34, 22],
          fill: true,
          borderColor: "#cc9123",
          tension: 0.4,
        },
        {
          label: "Halfday",
          data: [28, 48, 40, 19, 86, 27, 40, 32, 34, 54, 43, 21, 43],
          fill: true,
          borderColor: "#0d3075",
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div>
      <Chart
        height="13rem"
        type="line"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default AttendanceChart;
