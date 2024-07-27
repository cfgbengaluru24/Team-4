import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { useAuth } from "../hooks/useAuth";
import { v4 } from 'uuid';
import Sidebar from '../utils/Sidebar';
import { Navigate } from "react-router-dom";
import Loading from "../utils/Loading";
import SessionExpired from "./SessionExpired";
import { toast } from "react-toastify";

export default function RaiseQuery() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [queries, setQueries] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (!user) {
    return <Loading />;
  }

  if(!isAuthenticated){
    return <SessionExpired/>;
  }
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const questionRef = useRef();

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/query`);
      setQueries(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
      }
      console.log(err);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newQuery = {
      username: user.username,
      profilepicture: user.profilepicture,
      userId: user._id,
      question: questionRef.current.value,
    };

    if (file) {
      try {
        const imageRef = ref(storage, `query/${file.name}` + v4());
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(ref(imageRef));
        newQuery.image = url;
      } catch (err) {
        console.log(err);
      }
    }

    if (newQuery.question) {
      try {
        await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/query`, newQuery);
        setFile(null);
        questionRef.current.value = '';
        toast.success("Query Successfully Uploaded !!")
        fetchQueries();
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setIsAuthenticated(false);
        }
        console.log(err);
      }
    } else {
      setError("Add query to post");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, []);


  return (
    <div className="Home">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:ml-64 p-4">
        <button
          className={`md:hidden p-4 bg-gray-800 text-white rounded ${isSidebarOpen ? 'hidden' : 'block'}`}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <div className="flex items-center space-x-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={user.profilepicture}
                alt={user.username}
              />
              <textarea
                placeholder={`What's on your mind, ${user.username}?`}
                className="flex-grow resize-none border rounded-md p-2 focus:outline-none"
                ref={questionRef}
              />
            </div>
            {file && (
              <div className="mt-4">
                <img className="w-full rounded-md object-cover" src={URL.createObjectURL(file)} alt="" />
                <button
                  className="text-red-500 cursor-pointer bg-transparent border-none outline-none mt-2"
                  onClick={() => setFile(null)}
                >
                  Cancel
                </button>
              </div>
            )}
            <form className="mt-4 flex items-center justify-between" onSubmit={submitHandler}>
              <label htmlFor="file" className="flex items-center space-x-2 cursor-pointer">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm">Upload Photo</span>
                </span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Ask'}
              </button>
            </form>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
          
          <div>
            {queries.length ? (
              queries.map((query) => (
                <div key={query._id} className="bg-white p-4 rounded shadow-md mb-4 animate-fadeIn">
                  <div className="flex items-center space-x-4 mb-2">
                    <img src={query.profilepicture} alt={query.username} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-bold">{query.username}</div>
                      <div className="text-gray-500 text-sm">{new Date(query.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-gray-700 mb-2">{query.question}</div>
                  {query.image && <img src={query.image} alt="" className="w-full rounded-md mb-2" />}
                  {query.answer && <div className="bg-gray-200 p-2 rounded-md">{query.answer}</div>}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No queries found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
