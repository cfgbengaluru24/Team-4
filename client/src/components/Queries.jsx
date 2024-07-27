import React, { useEffect, useState } from 'react';
import Sidebar from '../utils/Sidebar';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import SessionExpired from './SessionExpired';
import { useAuth } from '../hooks/useAuth';
import Loading from '../utils/Loading';
import Unauthorized from '../utils/Unauthorized';
import { toast } from 'react-toastify';

function Queries() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
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
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostingReply, setIsPostingReply] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/query/all`);
      setQueries(res.data);
      setIsLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <SessionExpired/>;
  }

  const handleReply = (queryId) => {
    setSelectedQuery(queryId);
  };

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const submitReply = async () => {
    if (selectedQuery && replyText) {
      setIsPostingReply(true);
      try {
        await axios.put(`${import.meta.env.VITE_APP_SERVER_URL}/api/query/`, {
          queryId: selectedQuery,
          answer: replyText
        });
        setReplyText('');
        setSelectedQuery(null);
        toast.success("Replied Successfully !!");
        fetchQueries(); // Refresh queries after reply
      } catch (err) {
        console.log(err);
      } finally {
        setIsPostingReply(false);
      }
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-4 md:ml-64">
        <button
          className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-2xl font-bold mb-4">Queries</h1>
          {isLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            queries.length ? queries.map((query) => (
              <div key={query._id} className="bg-white p-4 rounded shadow-md mb-4 animate-fadeIn">
                <div className="flex items-center mb-4">
                  <img src={query.profilepicture} alt={query.username} className="w-10 h-10 rounded-full mr-4"/>
                  <div>
                    <div className="font-bold">{query.username}</div>
                    <div className="text-gray-500 text-sm">{new Date(query.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-gray-700 mb-2">{query.question}</div>
                {query.image && <img src={query.image} alt="Query" className="w-full h-auto mb-4"/>}
                <button onClick={() => handleReply(query._id)} className="bg-blue-500 text-white p-2 rounded mt-2">Reply</button>
                
                {selectedQuery === query._id && (
                  <div className="mt-4">
                    <textarea
                      value={replyText}
                      onChange={handleReplyChange}
                      className="w-full p-2 border rounded mb-2"
                      placeholder="Type your reply..."
                      disabled={isPostingReply}
                    />
                    <button
                      onClick={submitReply}
                      className="bg-green-500 text-white p-2 rounded"
                      disabled={isPostingReply}
                    >
                      {isPostingReply ? 'Submitting...' : 'Submit Reply'}
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <div className="text-gray-500">No queries found.</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Queries;
