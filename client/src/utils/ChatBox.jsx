import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Input from "./Input";
import Messages from "./Messages";

const ChatBox = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <img
            className="w-10 h-10 rounded-full"
            src={data.user?.profilepicture}
            alt=""
          />
          <span className="font-semibold text-gray-700">{data.user?.username}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Messages />
      </div>
      <div className="p-4 bg-white border-t border-gray-300">
        <Input />
      </div>
    </div>
  );
};

export default ChatBox;
