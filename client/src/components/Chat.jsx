import React, { useState } from 'react';
import Sidebar from '../utils/Sidebar';
import { Navigate } from 'react-router-dom';
import Chats from '../utils/Chats';
import ChatBox from '../utils/ChatBox';

function Chat() {

  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="Home h-screen flex flex-col">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:ml-64">
        <button
          className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        
        <div className="flex justify-evenly">
          <div className='min-h-screen bg-gray-100 p-8 w-1/3'>
            <div className=' p-4 font-bold'>Chats</div>
            <Chats />
          </div>
          <div className='h-[100vh] bg-gray-100 w-2/3' > 
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
