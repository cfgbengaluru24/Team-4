// src/components/Feed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../utils/Sidebar';
import Share from '../utils/Share';
import { Link } from 'react-router-dom';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

    useEffect(() => {
        fetchPosts();
        fetchAdmins();
    }, []);

    const fetchPosts = async () => {
        try {
            const response =await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/feed`);
            setPosts(response.data );
        } catch (err) {
            console.error(err);
        }
    };
    const fetchAdmins = async () => {
        try {
            const response =await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/admins`);
            setAdmins(response.data );
        } catch (err) {
            console.error(err);
        }
    };

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
        
        <div className='flex justify-evenly gap-4'  >
        <div className="min-h-screen bg-gray-100 p-8 w-full">
        <div>
            <div>
                <Share fetchPosts={fetchPosts} />
                {
                    posts.length &&
                    posts.map((post) => (
                        <div key={post._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <div className="flex items-center mb-2">
                                <img src={post.profilepicture} alt="Profile" className="rounded-full h-12 w-12 mr-4" />
                                <div>
                                    <Link to={`/profile/${post.userId}`}>
                                        <h4 className="text-lg font-semibold">{post.username}</h4>
                                    </Link>
                                    <small className="text-gray-600">{new Date(post.createdAt).toLocaleString()}</small>
                                </div>
                            </div>
                    
                            <p className="text-gray-800">{post.content}</p>
                    
                            {post.image && (
                                <img src={post.image} alt="Post" className="mt-4 rounded-lg shadow-md" />
                            )}
                        </div>
                    ))
                    
                }
            </div>
        </div>

        </div>
    <div className="hidden  md:block min-h-screen bg-gray-100 p-8 w-2/5 ">
    <div>Admins</div>
        {
            admins.length &&
            admins.map((admin, index) => (
                <div key={index} className="py-4 flex items-center">
                  <img src={admin.profilepicture} alt="Profile Picture" className="w-12 h-12 object-cover rounded-full mr-4" />
                  <div>
                    <div className="text-sm font-semibold">
                      <Link to={`/profile/${admin._id}`} className="text-blue-600 hover:underline">{admin.username}</Link>
                    </div>
                    <div className="text-xs text-gray-600">{admin.email}</div>
                    <div className="text-xs text-gray-500">{admin.userType}</div>
                  </div>
                </div>
              ))
        }
    </div>
        </div>
      </div>
    </div>
        
    );
};

export default Feed;
