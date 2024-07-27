// VisitsHeatmap.js
import React from "react";
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const VisitsHeatmap = () => {
    const [visitsData, setVisitsData] = useState([]);

    const generateDatesForYear = (year) => {
        const dates = [];
        const date = new Date(year, 0, 1);
        while (date.getFullYear() === year) {
          dates.push(new Date(date).toISOString().split('T')[0]);
          date.setDate(date.getDate() + 1);
        }
        return dates;
      };

    useEffect(() => {
      const year = new Date().getFullYear();
      const allDates = generateDatesForYear(year);
  
      const unsubscribe = onSnapshot(collection(db, "visits"), (snapshot) => {
        const data = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().userIds.length;
          return acc;
        }, {});
  
        const mergedData = allDates.map(date => ({
          date,
          count: data[date] || 0
        }));
  
        setVisitsData(mergedData);
      });
  
      // Cleanup listener on unmount
      return () => unsubscribe();
    }, []);

  // Group data by month for the heatmap
  const groupedData = visitsData.reduce((acc, { date, count }) => {
    const [year, month, day] = date.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    if (!acc[monthIndex]) acc[monthIndex] = [];
    acc[monthIndex].push({ x: day, y: count });
    return acc;
  }, []);

  const heatmapSeries = groupedData.map((monthData, index) => ({
    name: new Date(2020, index).toLocaleString('default', { month: 'short' }),
    data: monthData
  }));

  const chartOptions = {
    chart: {
      id: "visits-heatmap",
      type: 'heatmap'
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 1,
              color: '#E5E7EB'
            },
            {
              from: 1,
              to: 2,
              color: '#00A100'
            },
            {
              from: 21,
              to: 30,
              color: '#FFB200'
            },
            {
              from: 31,
              to: 40,
              color: '#FF0000'
            }
          ]
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'category'
    },
    yaxis: {
      title: {
        text: 'Day of the Month'
      }
    }
  };

  return (
    <div>
      <Chart
        options={chartOptions}
        series={heatmapSeries}
        type="heatmap"
        width="100%"
      />
    </div>
  );
};

export default VisitsHeatmap;
