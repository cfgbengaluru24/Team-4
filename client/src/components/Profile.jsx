import React, { useState } from 'react';
import Sidebar from '../utils/Sidebar';
import UserProfile from '../utils/UserProfile';
import Visitors from '../utils/Visitors';
import HeatmapChart from '../utils/Heatmap';
import AreaChart from '../utils/AreaChart';
import BarChart from '../utils/BarChart';
import ScatterChart from '../utils/ScatterChart';
import PieChart from '../utils/PieChart';
import DonutChart from '../utils/DonutChart';
import RadarChart from '../utils/RadarChart';


function Profile() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="Profile">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:ml-64 p-4">
        <button
          className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        
        <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <UserProfile />
        </div>
        {/* <div className="flex-1">
          <Visitors />
        </div> */}
      </div>
    </div>
      </div>
    </div>
  );
}

export default Profile;
