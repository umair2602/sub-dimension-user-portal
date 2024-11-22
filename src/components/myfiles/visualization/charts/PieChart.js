import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <></>;
  }

  // Filter out any items that may have invalid or empty data for the Gyro fields
  const filteredData = data.filter((item) => item["Gyro: NMEA1 Gyro"] && item["Gyro: NMEA2 Gyro"]);

  const totalGyro1 = filteredData.reduce(
    (sum, item) => sum + parseFloat(item["Gyro: NMEA1 Gyro"]),
    0
  );
  const totalGyro2 = filteredData.reduce(
    (sum, item) => sum + parseFloat(item["Gyro: NMEA2 Gyro"]),
    0
  );

  const chartData = {
    labels: ["Gyro NMEA1", "Gyro NMEA2"],
    datasets: [
      {
        data: [totalGyro1, totalGyro2],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
      },
    ],
  };

  return (
    <Box
      sx={{
        maxHeight: 280,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pie data={chartData} />
    </Box>
  );
};

export default PieChart;
