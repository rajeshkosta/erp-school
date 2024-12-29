import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";

const FacultyAttendenceTabChart = () => {
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
      labels: ["Teachers", "Administrator", "Accountant", "Others"],
      datasets: [
        {
          label: "Faculty",
          backgroundColor: "#e25c50",
          borderColor: "#e25c50",
          data: [65, 59, 80, 21],
        },
      ],
    };
    const options = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
      barThickness: 15,
      elements: {
        bar: {
          borderRadius: {
            topLeft: 3,
            topRight: 3,
            bottomLeft: 3,
            bottomRight: 3,
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
        height="14rem"
        type="bar"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default FacultyAttendenceTabChart;
