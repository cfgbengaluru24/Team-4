import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "jpmc-firebase.firebaseapp.com",
  projectId: "jpmc-firebase",
  storageBucket: "jpmc-firebase.appspot.com",
  messagingSenderId: "769966547477",
  appId: "",
  measurementId: "G-WGJTR27M27"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
