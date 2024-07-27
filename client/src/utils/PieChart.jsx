// src/PieChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const PieChart = () => {
  // Dummy data for the pie chart
  const seriesData = [44, 55, 41, 17, 15];

  const options = {
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div className="pie-chart">
      <Chart options={options} series={seriesData} type="pie" height={350} />
    </div>
  );
};

export default PieChart;
