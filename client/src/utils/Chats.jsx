import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState({});
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (user?._id) {
      const getChats = () => {
        const unsub = onSnapshot(doc(db, "userChats", user._id), (doc) => {
          console.log(doc.data());
          setChats(doc.data());
        });

        return () => {
          unsub();
        };
      };

      getChats();
    }
  }, [user]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="p-4">
      {chats && Object.keys(chats).length > 0 ? (
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map(([key, chat]) => (
            <div
              className="userChat flex items-center gap-4 p-2 hover:bg-gray-700 cursor-pointer rounded-md transition-colors"
              key={key}
              onClick={() => handleSelect(chat.userInfo)}
            >
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={chat.userInfo.profilepicture}
                alt={chat.userInfo.username}
              />
              <div className="userChatInfo hidden sm:flex flex-col">
                <span className="block text-lg font-semibold">{chat.userInfo.username}</span>
                <p className="text-sm text-gray-400">{chat.lastMessage?.text}</p>
              </div>
            </div>
          ))
      ) : (
        <div className="text-center p-6 text-gray-400 ">
          No Chats !!
        </div>
      )}
    </div>
  );
};

export default Chats;
