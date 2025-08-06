import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Typography } from '@mui/material';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FeatureChart = ({ id, rankedList, isComposite, chartLabel, isSatisfaction }) => {
  const data = {
    labels: rankedList.map(([feature]) => feature.replace('_', ' ').toUpperCase()),
    datasets: [
      {
        label: isSatisfaction ? 'Sentiment Count' : isComposite ? 'Score' : 'Mentions',
        data: rankedList.map(([, count]) => count),
        backgroundColor: rankedList.map((_, index) => (index === 0 ? '#36A2EB' : '#4BC0C0')),
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => isSatisfaction 
            ? `${context.raw} mentions` 
            : isComposite 
              ? `${context.raw.toFixed(3)} score` 
              : `${context.raw} mentions`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: isSatisfaction ? 'Sentiment Count' : isComposite ? 'Score' : 'Mention Count'
        }
      },
    },
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Typography variant="h6" gutterBottom align="center">
        {chartLabel}
      </Typography>
      <Bar key={id} data={data} options={options} />
    </div>
  );
};

export default FeatureChart;