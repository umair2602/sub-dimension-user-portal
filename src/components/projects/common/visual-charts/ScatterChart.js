import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const xAxis = {
  d1_col: "Position: GPS1 (NMEA): East",
  d2_col: "Position: GPS2 (NMEA): East",
};

const ScatterPlot = ({ data }) => {
  // Processed dataset for Chart.js
  const dataset1 = data?.map((item) => ({
    x: parseFloat(item[xAxis.d1_col]),
    y: parseFloat(item["North"]),
  }));

  const dataset2 = data?.map((item) => ({
    x: parseFloat(item[xAxis.d2_col]),
    y: parseFloat(item["North"]),
  }));

  // Chart data configuration
  const config = {
    datasets: [
      {
        label: xAxis.d1_col,
        data: dataset1,
        backgroundColor: "darkblue",
      },
      {
        label: xAxis.d2_col,
        data: dataset2,
        backgroundColor: "darkorange",
      },
    ],
  };

  const options = {
    animation: false,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Scatter data={config} options={options} />;
};

export default ScatterPlot;
