import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";

const StudentRatioChart = () => {
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
      
        // width="100%"

        width={250} // Set the width of the chart
        height={250} // Set the height of the chart
      />
    </div>
  );
};

export default StudentRatioChart;
