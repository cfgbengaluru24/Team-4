import React from 'react';
import Chart from 'react-apexcharts';

const HeatmapChart = () => {
  const generateData = (count, yrange) => {
    let i = 0;
    let series = [];
    while (i < count) {
      let x = (i + 1).toString();
      let y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({ x, y });
      i++;
    }
    return series;
  };

  const options = {
    chart: {
      id: 'heatmap',
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 50,
              color: '#F3F4F6',
              name: 'low',
            },
            {
              from: 51,
              to: 100,
              color: '#128FD9',
              name: 'medium',
            },
            {
              from: 101,
              to: 150,
              color: '#FFB200',
              name: 'high',
            },
            {
              from: 151,
              to: 200,
              color: '#FF0000',
              name: 'extreme',
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'category',
    },
    title: {
      text: 'HeatMap Chart',
    },
  };

  const series = [
    {
      name: 'Metric 1',
      data: generateData(20, { min: 0, max: 200 }),
    },
    {
      name: 'Metric 2',
      data: generateData(20, { min: 0, max: 200 }),
    },
    {
      name: 'Metric 3',
      data: generateData(20, { min: 0, max: 200 }),
    },
    {
      name: 'Metric 4',
      data: generateData(20, { min: 0, max: 200 }),
    },
    {
      name: 'Metric 5',
      data: generateData(20, { min: 0, max: 200 }),
    },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <Chart options={options} series={series} type="heatmap" height={350} />
    </div>
  );
};

export default HeatmapChart;
