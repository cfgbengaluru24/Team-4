import React, { createContext, useEffect, useState } from 'react';
import registerSW from '../registerSW';
import { db } from "../firebase";
export const UserContext = createContext();
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const trackUsers = async ({user}) => {
    const userId = user._id;
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const visitDocRef = doc(db, "visits", today);

    const visitDoc = await getDoc(visitDocRef);
    if (visitDoc.exists()) {
      const visitData = visitDoc.data();
      if (!visitData.userIds.includes(userId)) {
        await updateDoc(visitDocRef, { userIds: arrayUnion(userId) });
      }
    } else {
      await setDoc(visitDocRef, { userIds: [userId] });
    }
  }

  useEffect(()=>{
    if(user){
      //update service worker with user for notification purpose
      registerSW({user});

      // tracking users visited the site
      trackUsers({user});
    }
  },[user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
