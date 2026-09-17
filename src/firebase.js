import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkMo_Es88h0VldYc24qxS4kuoaH9TH1jA",
  authDomain: "raga-5de03.firebaseapp.com",
  projectId: "raga-5de03",
  storageBucket: "raga-5de03.firebasestorage.app",
  messagingSenderId: "147847142253",
  appId: "1:147847142253:web:37b998e3860347439d1864"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);