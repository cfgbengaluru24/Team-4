// src/AreaChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const AreaChart = () => {
  // Dummy data for the area chart
  const seriesData = [{
    name: 'Series 1',
    data: [30, 40, 25, 50, 49, 21, 70, 51, 42, 30, 40, 25]
  }];

  const options = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ['01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023', '05/01/2023', '06/01/2023', '07/01/2023', '08/01/2023', '09/01/2023', '10/01/2023', '11/01/2023', '12/01/2023'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yyyy'
      },
    },
  };

  return (
    <div className="area-chart">
      <Chart options={options} series={seriesData} type="area" height={350} />
    </div>
  );
};

export default AreaChart;
