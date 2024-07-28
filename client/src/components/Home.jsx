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
        <img src="https://i0.wp.com/cadetprogram.org/wp-content/uploads/2023/06/The-CADET-Program-EXPA-.png?fit=1000%2C500&ssl=1" alt="EXPA Logo" class="w-full h-auto rounded-lg shadow-md"/>
        
        <div class="mt-4 text-center text-2xl font-bold text-blue-700">Welcome to ERPA India Official Website</div>
        
        <div class="mt-4 p-6 bg-white rounded-lg shadow-lg">
            <p class="text-lg text-gray-700">EXPA (NCC Exchange Participants Association of India) is a Society registered under the Karnataka Societies Registration Act, 1960, in Bangalore, Karnataka.</p>
            <p class="mt-2 text-lg text-gray-700">EXPA’s members are NCC cadets who have traveled abroad on the NCC Youth Exchange Program, whereby selected cadets participate in a country-to-country exchange of cadets belonging to youth organizations of friendly countries. The YEP, in place since 1979, has included an estimated 5,000 cadets over the years.</p>
            
            <h2 class="mt-6 text-xl font-semibold text-gray-800">OUR OBJECTIVE</h2>
            <ul class="list-disc list-inside mt-2 text-lg text-gray-700">
                <li>To develop confident and articulate NCC cadets.</li>
                <li>To develop the youth of India towards becoming responsible citizens.</li>
                <li>To assist the NCC in developmental activities.</li>
                <li>To create a forum for Ex-NCC Cadets and to promote International understanding via developmental activities.</li>
            </ul>
            
            <p class="mt-4 text-lg text-gray-700">Today, there are over 5,000 such ‘EXPA’s all over the world, aged anywhere from the mid-fifties to the still-in-college twenties. EXPAs today are in various domains of Defence, Govt., business, and technology.</p>
            
            <p class="mt-4 text-lg text-gray-700">Reflecting the inclusive spirit of the NCC, EXPA is committed to fostering positive change in our society. EXPA is an apolitical and areligious organization, ensuring that our focus remains solely on the betterment of our youth and society at large.</p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
