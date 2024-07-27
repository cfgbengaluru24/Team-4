// src/components/Chart.js
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const MyChart = () => {
  const [data, setData] = useState({
    series: [{
      name: 'Sample Data',
      data: [10, 20, 30, 40, 50,10,19,29,0]
    }],
    options: {
      chart: {
        type: 'line'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May','june','july']
      }
    }
  });

  return (
    <div className="chart">
      <Chart options={data.options} series={data.series} type="line" height={350} />
    </div>
  );
};

export default MyChart;
