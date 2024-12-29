import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";

const RatioChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["Male", "Female", "Others"],
      datasets: [
        {
          data: [200, 100, 10],
          backgroundColor: [
            "#e25c50",
            "#a366ff",
            documentStyle.getPropertyValue("--green-500"),
          ],
          hoverBackgroundColor: [
            "#e25c50",
            "#a366ff",
            documentStyle.getPropertyValue("--green-400"),
          ],
        },
      ],
    };
    const options = {
      cutout: "60%",
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Chart
        type="doughnut"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-50rem"
        // width="100%"

        width={200} // Set the width of the chart
        height={200} // Set the height of the chart
      />
    </div>
  );
};

export default RatioChart;
