import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ChartComponent = () => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then((res) => res.json())
      .then((data) => setApiData(data));
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sample Data',
        data: [10, 20, 15, 25, 30],
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Sample Chart</h2>
      <Line data={data} />
      {apiData && <p>{apiData.message}</p>}
    </div>
  );
};

export default ChartComponent;