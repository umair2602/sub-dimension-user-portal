import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { parse } from "date-fns";

ChartJS.register(LineElement, TimeScale, PointElement, Tooltip, Legend, Title);

const yAxis = {
  d1_col: "Gyro: NMEA1 Gyro",
  d2_col: "Gyro: NMEA2 Gyro",
};

const parseDate = (dateStr) => {
  if (dateStr === undefined) {
    return new Date();
  }
  return parse(dateStr, "dd.MM.yyyy HH:mm:ss", new Date());
};

const LineChart = ({ data }) => {
  // Processed dataset for Chart.js
  const dataset1 = data?.map((item) => ({
    x: parseDate(item?.Time).getTime(),
    y: parseFloat(item[yAxis.d1_col]),
  }));

  const dataset2 = data?.map((item) => ({
    x: parseDate(item?.Time).getTime(),
    y: parseFloat(item[yAxis.d1_col]),
  }));

  // Chart data configuration
  const config = {
    datasets: [
      {
        label: yAxis.d1_col,
        borderColor: "darkblue",
        borderWidth: 1,
        radius: 0,
        data: dataset1,
      },
      {
        label: yAxis.d2_col,
        borderColor: "darkorange",
        borderWidth: 1,
        radius: 0,
        data: dataset2,
      },
    ],
  };

  // Chart options
  const options = {
    animation: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
      },
    },
  };

  return <Line data={{ datasets: config.datasets }} options={options} />;
};

export default LineChart;
