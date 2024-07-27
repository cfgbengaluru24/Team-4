// src/ScatterChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const ScatterChart = () => {
  // Dummy data for the scatter chart
  const seriesData = [{
    name: 'Sample Data',
    data: [
      [10, 20],
      [20, 30],
      [30, 40],
      [40, 50],
      [50, 60],
      [60, 70],
      [70, 80],
      [80, 90],
      [90, 100]
    ]
  }];

  const options = {
    chart: {
      type: 'scatter',
      height: 350,
      zoom: {
        enabled: false
      }
    },
    xaxis: {
      type: 'numeric',
      title: {
        text: 'X Axis'
      }
    },
    yaxis: {
      title: {
        text: 'Y Axis'
      }
    }
  };

  return (
    <div className="scatter-chart">
      <Chart options={options} series={seriesData} type="scatter" height={350} />
    </div>
  );
};

export default ScatterChart;
