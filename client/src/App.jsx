import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Home from './components/Home';
import Feed from './components/Feed';
import axios from 'axios';
import Verify from './components/Verify';
import NotFound from './utils/NotFound';
import RaiseQuery from './components/RaiseQuery';
import Queries from './components/Queries';
import { ChatContextProvider } from './context/ChatContext';
import {toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApproveTrainer from './components/ApproveTrainer';
import BookTicket from './utils/BookTicket';

// Set up Axios interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['authorization'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


const App = () => (
  <UserProvider>
    <ChatContextProvider>
    <Router>
      <Routes>
        <Route path="/book-tickets" element={<BookTicket />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/approvetrainer" element={<ApproveTrainer />} />
          <Route path="/verify" element={<Verify/>} />
          <Route path="/raisequery" element={<RaiseQuery/>} />
          <Route path="/queries" element={<Queries/>} />
          <Route path="/profile/:userid" element={<Profile />} />
          <Route path="/chat/:recipientId" element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/home" element={<Home />} />
         
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    <ToastContainer/>
    </ChatContextProvider>
  </UserProvider>
);

export default App;