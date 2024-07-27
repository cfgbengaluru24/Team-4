import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { db } from "../firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const register = async (username, email, password, otp, userType, gender) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/register`, { username, email, password, otp, userType, gender }); 
      const u=res.data;
      await setDoc(doc(db, "userChats", u._id), {});
      toast.success("Registered Successfully");

      //add user id to firestore for admin dashboard
      await addDoc(collection(db, "users"), {
        userId : u._id,
        userType : u.userType
      });

      navigate('/login');
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email,password,setShowOtpVerification) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/sendOtp`, { email, password });
      toast.info("Otp Sent Successfully");
      setShowOtpVerification(true);
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success("Login Successfull !! ");
      navigate('/home');
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    toast.success("Logged Out Successfully !!")
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    sendOtp,
    setUser,
    setError
  };
};
