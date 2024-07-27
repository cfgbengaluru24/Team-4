import React, { useState } from 'react';
import Sidebar from '../utils/Sidebar';
import { Navigate } from 'react-router-dom';

function Home() {

  const token= localStorage.getItem('token');
  if(!token){
    return <Navigate to="/login"/>;
  }
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="Home">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:ml-64 p-4">
        <button
          className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        
        <div className="min-h-screen bg-gray-100 p-8">
        </div>
      </div>
    </div>
  );
}

export default Home;
