// src/BarChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = () => {
  // Dummy data for the bar chart
  const seriesData = [{
    name: 'Series 1',
    data: [44, 55, 41, 64, 22, 43, 21]
  }];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    }
  };

  return (
    <div className="bar-chart">
      <Chart options={options} series={seriesData} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
