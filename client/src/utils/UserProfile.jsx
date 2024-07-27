import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';
import { v4 } from 'uuid';
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SessionExpired from '../components/SessionExpired';
import { ChatContext } from "../context/ChatContext";
import { toast } from 'react-toastify';

import {
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const UserProfile = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [isAuthenticated, setIsAuthenticated] = useState(true); // State to manage authentication status
  let { userid } = useParams();
  const { dispatch } = useContext(ChatContext);

  const navigate = useNavigate();
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/${userid}`);
      setCurrUser(response.data);
      setLoading(false); // Update loading state once data is fetched
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
      }
      setLoading(false); // Ensure loading state is updated even on error
    }
  };
  useEffect(() => {
    fetchData();
  }, [userid]); // Include userid in dependencies to fetch data when it changes

  if (!isAuthenticated) {
    return <SessionExpired/> ;
  }

  if (!user || !currUser) {
    return <Loading />;
  }

  const handleProfilePicture = async () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const imageref = ref(storage, `profilepicture/${file.name}` + v4());
      await uploadBytes(imageref, file);
      const url = await getDownloadURL(ref(imageref));
      await axios.put(`${import.meta.env.VITE_APP_SERVER_URL}/api/user/profilepicture`, { profilepicture: url });
      fetchData();
      toast.success("Profile Picture Updated");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
      } else {
        console.error(err);
      }
    }
  };

  const handleMessaging = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      user._id > currUser._id
        ? user._id + currUser._id
        : currUser._id + user._id;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", user._id), {
          [combinedId + ".userInfo"]: {
            _id: currUser._id,
            username: currUser.username,
            profilepicture: currUser.profilepicture,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", currUser._id), {
          [combinedId + ".userInfo"]: {
            _id: user._id,
            username: user.username,
            profilepicture: user.profilepicture,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }

      const u = {
        profilepicture:currUser.profilepicture,
        username:currUser.username,
        _id: currUser._id
      }

      dispatch({ type: "CHANGE_USER", payload: u });

      navigate("/chat");


    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center p-4 bg-white shadow rounded-lg">
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept=".png,.jpeg,.jpg"
          className="hidden"
          onChange={handleImageChange}
        />
        <img
          className="w-16 h-16 rounded-full mr-4"
          src={currUser.profilepicture}
          alt="Profile"
        />
        <button 
          className={`absolute bottom-0 right-2 h-6 w-6 bg-gray-300 text-gray-700 rounded-full p-1 ${user._id !== currUser._id ? 'hidden' : ''}`}
          onClick={handleProfilePicture}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/4226/4226577.png" alt="edit" />
        </button>
      </div>

      <div className="flex-1"> {/* Flex-1 to make the content take remaining space */}
        <div>
          <h2 className="text-xl font-bold">{currUser.username}</h2>
          <p className="text-gray-600">{currUser.email}</p>
        </div>
      </div>
      <div> {/* This div will be placed at the end */}
        <button onClick={handleMessaging} className={`${user._id === currUser._id ? 'hidden' : ''}`}>
          <img
            className="w-6 h-6"
            src="https://cdn-icons-png.flaticon.com/128/542/542689.png"
            alt="msg"
          />
        </button>
      </div>
    </div>
  );
  
  
};

export default UserProfile;
