import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import { saveMessages, getMessages } from '../indexedDB';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const fetchMessages = async () => {
      const cachedMessages = await getMessages(data.chatId);
      if (cachedMessages) {
        setMessages(cachedMessages);
      }
    };

    fetchMessages();

    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        const newMessages = doc.data().messages;
        setMessages(newMessages);
        saveMessages(data.chatId, newMessages);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
      {
        messages.length>0 
        ?
        messages.map((m) => (
          <Message message={m} key={m.id} />
        ))
        :
        <div className="text-center my-32 text-gray-400">No chats to display</div>
      }
    </div>
  );
};

export default Messages;
