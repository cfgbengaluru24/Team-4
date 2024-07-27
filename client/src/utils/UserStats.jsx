import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // ensure you have Firebase setup and initialized
import { collection, onSnapshot } from 'firebase/firestore';
import ApexCharts from 'react-apexcharts';

const UserStats = () => {
  const [userData, setUserData] = useState({ users: 0, admins: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      let users = 0;
      let admins = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userType === 'user') {
          users += 1;
        } else if (data.userType === 'admin') {
          admins += 1;
        }
      });
      setUserData({ users, admins });
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const chartOptions = {
    series: [userData.users, userData.admins],
    labels: ['Users', 'Admins'],
    chart: {
      type: 'donut',
    },
  };

  return (
    <div>
      <ApexCharts options={chartOptions} series={chartOptions.series} type="donut" />
    </div>
  );
};

export default UserStats;
