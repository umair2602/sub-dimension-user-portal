import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <></>;
  }

  const chartData = {
    labels: data.map((item) => item.Time),
    datasets: [
      {
        label: "Gyro NMEA1",
        data: data.map((item) => parseFloat(item["Gyro: NMEA1 Gyro"])),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Gyro NMEA2",
        data: data.map((item) => parseFloat(item["Gyro: NMEA2 Gyro"])),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
