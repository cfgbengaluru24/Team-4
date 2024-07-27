import React, { useState } from 'react';
import Sidebar from '../utils/Sidebar';
import { Navigate } from 'react-router-dom';
import Visitors from '../utils/Visitors';
import VisitsHeatmap from '../utils/VisitsHeatmap';
import UserStats from '../utils/UserStats';
import { useAuth } from '../hooks/useAuth';
import Loading from '../utils/Loading';
import Unauthorized from '../utils/Unauthorized';

function Dashboard() {

  const token = localStorage.getItem('token');
  if(!token) {
    return <Navigate to="/login"/>
  }
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const { user } = useAuth();
  if (!user) {
    return <Loading/>;
  }
  if (user.userType !== 'admin') {
    return <Unauthorized/>;
  }
  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:ml-64 p-4">
        <button
          className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        
        <div className="flex flex-wrap min-h-screen bg-gray-100 p-8">

          <div className="w-1/2">
            <Visitors/>
          </div>
          <div className="w-1/2">
            <UserStats/>
          </div>
          <div className="w-full">
            <VisitsHeatmap/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
