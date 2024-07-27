import React, { useState } from 'react';
import Sidebar from '../utils/Sidebar';
import { Navigate } from 'react-router-dom';
import data from '../tempTrainer.json';
import axios from 'axios';

function ApproveTrainer() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  const [validatedData, setValidatedData] = useState(data[0].camp1); // Initialize with data from first camp
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('camp1'); // Default region
  const [userInput, setUserInput] = useState(''); // State to hold user input

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRegionChange = (event) => {
    const selected = event.target.value;
    setSelectedRegion(selected);
    setValidatedData(data.find(camp => Object.keys(camp).includes(selected))[selected]);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const validateUsers = async () => {
    if (isNaN(userInput) || userInput.trim() === '') {
      alert('Invalid input. Please enter a valid number.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/trainee/validate`, {
        number: userInput,
        validatedData,
        selectedRegion
      });
      setValidatedData(response.data);
      console.log(validatedData);
    } catch (err) {
      // Handle error, e.g., display a notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ApproveTrainer">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:ml-64 p-4">
        <button
          className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <div className="min-h-screen bg-gray-100 p-8">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Training List</h1>
            
            <select 
              value={selectedRegion} 
              onChange={handleRegionChange} 
              className="mb-4 px-4 py-2 border rounded"
            >
              <option value="camp1">Camp 1</option>
              <option value="camp2">Camp 2</option>
              {/* Add more options if there are more regions */}
            </select>

            <div className="mb-4">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded"
                placeholder="Enter a number"
              />
              <button
                onClick={validateUsers}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Validating...' : 'Validate Users'}
              </button>
            </div>

            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Gender</th>
                  <th className="py-2 px-4 border-b">Location</th>
                  <th className="py-2 px-4 border-b">Trainings Taken</th>
                </tr>
              </thead>
              <tbody>
                {validatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{item.name}</td>
                    <td className="py-2 px-4 border-b">{item.gender}</td>
                    <td className="py-2 px-4 border-b">{item.location}</td>
                    <td className="py-2 px-4 border-b">{item.trainingsTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApproveTrainer;
