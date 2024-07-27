import React, { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Message = ({ message }) => {
  const { user } = useContext(UserContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const relativeDate = dayjs.unix(message.date.seconds).fromNow();

  const isOwner = message.senderId === user._id;

  return (
    <div ref={ref} className={`flex ${isOwner ? "justify-end" : "justify-start"} mb-4`}>
      {!isOwner && (
        <img
          className="w-8 h-8 rounded-full mr-2"
          src={data.user.profilepicture}
          alt=""
        />
      )}
      <div className={`flex flex-col space-y-2 text-sm max-w-xs ${isOwner ? "items-end" : "items-start"}`}>
        <div className={`relative ${isOwner ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"} p-3 rounded-lg shadow-md`}>
          <p>{message.text}</p>
          {message.img && <img className="mt-2 rounded-lg" src={message.img} alt="" />}
        </div>
        <span className="text-gray-500 text-xs mt-1">{relativeDate}</span>
      </div>
      {isOwner && (
        <img
          className="w-8 h-8 rounded-full ml-2"
          src={user.profilepicture}
          alt=""
        />
      )}
    </div>
  );
};

export default Message;
