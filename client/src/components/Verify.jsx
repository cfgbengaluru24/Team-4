import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../utils/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Loading from '../utils/Loading';
import Unauthorized from '../utils/Unauthorized';
import SessionExpired from './SessionExpired';
import { toast } from 'react-toastify';

function Verify() {

  const token = localStorage.getItem('token');
  if(!token){
    return <Navigate to="/login"/>
  }

  const { user } = useAuth();
  // Render loading state until user data is loaded
  if (!user) {
    return <Loading/>;
  }

  // Render unauthorized access message for non-admin users
  if (user.userType !== 'admin') {
    return <Unauthorized/>;
  }
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading state for verify
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch unverified users on component mount
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/unverified`);
      setUsers(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
      }
      console.error('Error fetching users:', err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle verification of a user
  const handleVerify = async (userId) => {
    try {
      setLoading(true); // Set loading state to true
      await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/verify/${userId}`);
      toast.success("Verified Successfully");
      // Refresh users after verification
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
      }
      console.error('Error verifying user:', err);
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  // Handle decline of a user
  const handleDecline = async (userId) => {
    try {
      setLoading(true); // Set loading state to true
      await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/decline/${userId}`);
      toast.success("Request Declined Successfully");
      // Refresh users after decline
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
      }
      console.error('Error declining user:', err);
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };
  
  if(!isAuthenticated){
    return <SessionExpired/>
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

        <div className="min-h-screen bg-gray-100 p-8">
          {users && users.length > 0 ? (
            users.map((u) => (
              <div key={u._id} className="flex items-center mb-4 p-4 bg-white shadow rounded-lg">
                <img src={u.profilepicture} alt="profile" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="text-lg font-semibold">{u.username}</div>
                  <div className="text-gray-600">{u.email}</div>
                  <div className="text-sm text-gray-500">{u.userType}</div>
                </div>
                <button
                  className={`ml-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleVerify(u._id)}
                  disabled={loading}
                >
                  Verify
                </button>
                <button
                  className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleDecline(u._id)}
                  disabled={loading}
                >
                  Decline
                </button>
              </div>
            ))
          ) : (
            <div  className='text-2xl font-bold text-center'>No unverified users</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Verify;
