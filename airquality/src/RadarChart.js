import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data }) => {
  // Define harmful values for each component
  const harmfulValues = {
    "PM2.5": 100, // Very harmful
    "PM10": 80,   // Harmful
    "NO": 60,     // Moderately harmful
    "NO2": 70,    // Harmful
    "SO2": 75,    // Harmful
    "Ozone": 90,  // Very harmful
    "CO": 50,     // Less harmful
  };

  const chartData = {
    labels: ['PM2.5', 'NO', 'SO₂', 'Ozone', 'PM10', 'CO'],
    datasets: [
      {
        label: 'Harmfulness Index',
        data: [
          harmfulValues["PM2.5"],
          harmfulValues["NO"],
          harmfulValues["SO2"],
          harmfulValues["Ozone"],
          harmfulValues["PM10"],
          harmfulValues["CO"],
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
     
        ticks: {
          display: false,  // Hide the ticks
        },
        min: 0,
        max: 100, // Adjust according to your harmfulness scale
      },
    },
    plugins: {
      legend: {
        display: true, // Show the legend if needed
      },
    },
  };

  return <Radar data={chartData} options={options} />;
};

export default RadarChart;
