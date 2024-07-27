import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import SessionExpired from './SessionExpired';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  if(!token){
    return <Navigate to="/login"/>
  }
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { setUser } = useAuth();
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/verify`);
        setUser(resp.data); // Update user state
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setIsAuthenticated(false);
        }
        console.error('Token verification failed:', err);
      }
    };

    verifyToken();
  }, [token, setUser]); // Ensure setUser and setError are stable

  if(!isAuthenticated){
    return <SessionExpired/>
  }
  
  return <Outlet />;
};

export default PrivateRoute;
