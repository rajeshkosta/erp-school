import React, { useEffect, useState } from "react";

import { Chart } from "primereact/chart";

const FeesStatusChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const containerWidth = window.innerWidth;

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
          type: "bar",
          label: "Pending",
          backgroundColor: "#e25c50",
          data: [50, 25, 12, 38, 50, 36, 42, 35, 56, 34, 67, 23, 30],
        },
        {
          type: "bar",
          label: "Completed",
          backgroundColor: "#fbebe9",
          data: [21, 44, 24, 45, 37, 25, 34, 20, 25, 12, 38, 46, 20],
        },
      ],
    };

    const maxBarThickness = 15;
    const responsiveBarThickness = containerWidth <= 380 ? maxBarThickness : 20;

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: "index",
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,

          ticks: {
            color: "#DB3525",
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          stacked: true,

          ticks: {
            color: "#DB3525",
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
      barThickness: responsiveBarThickness,
      elements: {
        bar: {
          borderRadius: {
            topLeft: 3,
            topRight: 3,
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
        height="12rem"
        type="bar"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default FeesStatusChart;
