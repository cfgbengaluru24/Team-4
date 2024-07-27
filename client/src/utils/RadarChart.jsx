// src/RadarChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const RadarChart = () => {
  // Dummy data for the radar chart
  const seriesData = [{
    name: 'Series 1',
    data: [80, 50, 30, 40, 60, 20],
  }, {
    name: 'Series 2',
    data: [20, 30, 40, 80, 20, 80],
  }, {
    name: 'Series 3',
    data: [44, 76, 78, 13, 43, 10],
  }];

  const options = {
    chart: {
      height: 350,
      type: 'radar',
    },
    xaxis: {
      categories: ['January', 'February', 'March', 'April', 'May', 'June']
    }
  };

  return (
    <div className="radar-chart">
      <Chart options={options} series={seriesData} type="radar" height={350} />
    </div>
  );
};

export default RadarChart;
