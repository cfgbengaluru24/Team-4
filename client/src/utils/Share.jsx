import { useRef, useState } from "react";
import axios from "axios";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { useAuth } from "../hooks/useAuth";
import { v4 } from 'uuid';
import { toast } from "react-toastify";

export default function Share({fetchPosts}) {
  const { user } = useAuth();
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading ] =useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newPost = {
      username: user.username,
      profilepicture: user.profilepicture,
      userId: user._id,
      content: desc.current.value,
      userType: user.userType,
    };

    if (file) {
      try {
        const imageref = ref(storage, `posts/${file.name}`+v4());
        await uploadBytes(imageref, file);
        const url = await getDownloadURL(ref(imageref));
        newPost.image = url;
      } catch (err) {
        console.log(err);
      }
    }

    if (file || newPost.content) {
      try {
        await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/feed`, newPost);
        setFile(null);
        desc.current.value='';
        fetchPosts();
        toast.success("Post Uploaded Successfully")
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Add description or image to Post");
    }
    setIsLoading(false);
  };

  return (
    <>
    {
      user 
      
      &&

      <div className="bg-white p-4 rounded shadow-md mb-6">
      <div className="flex items-center space-x-4">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={user.profilepicture}
          alt={user.username}
        />
        <textarea
          placeholder={`What's in your mind, ${user.username}?`}
          className="flex-grow resize-none border rounded-md p-2 focus:outline-none"
          ref={desc}
        />
      </div>
      {file && (
        <div className="mt-4">
          <img className="w-full rounded-md object-cover" src={URL.createObjectURL(file)} alt="" />
          <button
            className="text-red-500 cursor-pointer bg-transparent border-none outline-none"
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
          {isLoading ? 'Processing...' : 'Share'}
        </button>

      </form>
    </div>
    }
    </>
  );
}
