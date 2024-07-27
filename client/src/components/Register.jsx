import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate ,useNavigate } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate();

  const { register, loading, error, sendOtp, user } = useAuth();
  if(localStorage.getItem('token')) {
    return <Navigate to="/home"/>
  }
    
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
        if (!showOtpVerification) {
          await sendOtp(email, password, setShowOtpVerification);
      } else {
          await register(username, email, password, otp, userType);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error && (
        <div className="fixed top-0 right-0 m-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error.Error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform focus:scale-105"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform focus:scale-105"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform focus:scale-105"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">User Type</label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              required
              name="userType"
              onChange={() => setUserType("user")}
              className="form-radio h-4 w-4 text-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            />
            <span className="ml-2">User</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              required
              name="userType"
              onChange={() => setUserType("admin")}
              className="form-radio h-4 w-4 text-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            />
            <span className="ml-2">Admin</span>
          </label>
        </div>
        {showOtpVerification && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">OTP</label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform focus:scale-105"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          Register
        </button>

      </form>
    </div>
  );
};

export default Register;
