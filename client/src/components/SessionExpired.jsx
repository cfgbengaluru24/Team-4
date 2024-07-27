import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpired = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Session Timed Out</h1>
        <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
        <button
          onClick={handleClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
