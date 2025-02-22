import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {

  const { user, logout } = useAuth();

  return (
    <>
      {
        user && 
        <div
      className={`fixed inset-y-0 left-0 transform md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 h-screen z-50`}
    >
      <div className="p-4">
        <div>
          <img src="https://pbs.twimg.com/profile_images/1276595758934953990/NbHzzi7h_400x400.jpg" alt="" className='rounded-full w-40 p-2' />
        </div>
        <ul className="mt-4">
          <Link to="/home" >
            <div className="py-2 px-4 hover:bg-gray-700 rounded">
              Home
            </div>
          </Link>   
          <Link to={`/profile/${user._id}`} >
            <div className="py-2 px-4 hover:bg-gray-700 rounded">
              Profile
            </div>
          </Link>   
          <Link to="/chat" >
            <div className="py-2 px-4 hover:bg-gray-700 rounded">
              Chat
            </div>
          </Link>   
          <Link to="/feed" >
            <div className="py-2 px-4 hover:bg-gray-700 rounded">
              Feed
            </div>
          </Link> 
          {
            
            user.userType!=='admin' && 
            <>
            <Link to="/raisequery" >
              <div className="py-2 px-4 hover:bg-gray-700 rounded">
                Raise a Query
              </div>
            </Link> 
            </>
          }  
          {
            
            user.userType==='admin' && 
            <>
            <Link to="/dashboard" >
              <div className="py-2 px-4 hover:bg-gray-700 rounded">
                Dashboard
              </div>
            </Link> 
            <Link to="/verify" >
              <div className="py-2 px-4 hover:bg-gray-700 rounded">
                Verify
              </div>
            </Link> 
            <Link to="/approvetrainer" >
              <div className="py-2 px-4 hover:bg-gray-700 rounded">
                Approve Trainer
              </div>
            </Link> 
            <Link to="/queries" >
              <div className="py-2 px-4 hover:bg-gray-700 rounded">
                Queries
              </div>
            </Link> 
            <Link to="/graphs" >
              <div className="py-2 px-4 hover:bg-gray-700 rounded">
                statistics
              </div>
            </Link> 
            </>
          }  
          
          <button className="py-2 px-4 hover:bg-gray-700 rounded" onClick={()=>{logout()}}>
            LogOut
          </button>
          
        </ul>
      </div>
      <button
        className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-200 focus:outline-none md:hidden"
        onClick={toggleSidebar}
      >
        ✖️
      </button>
    </div>
      }
    </>
  );
};
export default Sidebar;
