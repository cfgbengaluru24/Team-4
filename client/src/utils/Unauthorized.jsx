// src/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';
const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You do not have the necessary permissions to view this page.
        </p>
        <Link to="/home" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
