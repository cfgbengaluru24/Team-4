import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { db } from '../firebase';
import { collection, onSnapshot } from "firebase/firestore";

const Visitors = () => {

  const [visitsData, setVisitsData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "visits"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        date: doc.id,
        count: doc.data().userIds.length
      }));
      setVisitsData(data);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const options = {
    chart: {
      id: 'visitors-chart',
      type: 'line',
      // height: 350
    },
    xaxis: {
      // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000],
      categories: visitsData.map(data => data.date)
    },
  };

  const series = [
    {
      name: 'Visitors',
      data: visitsData.map(data => data.count),
      // data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 110],
    },
    // {
    //   name: 'another line in same graph if required',
    //   data: [23, 30, 34, 90, 19, 20, 74, 61, 25, 10],
    // },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
      />
    </div>
  );
};

export default Visitors;
