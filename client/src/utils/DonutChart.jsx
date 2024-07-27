// src/DonutChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const DonutChart = () => {
  // Dummy data for the donut chart
  const seriesData = [44, 55, 13, 43, 22];

  const options = {
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: ['Apple', 'Banana', 'Cherry', 'Dates', 'Elderberry'],
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
    <div className="donut-chart">
      <Chart options={options} series={seriesData} type="donut" height={350} />
    </div>
  );
};

export default DonutChart;
