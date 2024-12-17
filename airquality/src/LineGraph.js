import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all components, including scales
Chart.register(...registerables);

const LineGraph = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.time),
    datasets: [
      {
        label: 'Air Quality Over Time',
        data: data.map(item => item.value),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineGraph;
