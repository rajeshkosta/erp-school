import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";

const EarningChart = () => {
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
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Earnings",
          data: [12, 51, 22, 33, 21, 62, 45, 40, 34, 23, 21, 65],
          fill: true,
          borderColor: documentStyle.getPropertyValue("--purple-500"),
          tension: 0.4,
          // backgroundColor: "blue",
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

            callback: function (value) {
              return value + "k";
            },
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

export default EarningChart;
