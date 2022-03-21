import React from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAytAEzCj_y6DC9krfJPNFTgKzcRaUk04Q",
  authDomain: "guessing-game-55ae5.firebaseapp.com",
  projectId: "guessing-game-55ae5",
  storageBucket: "guessing-game-55ae5.appspot.com",
  messagingSenderId: "852608296929",
  appId: "1:852608296929:web:11f369fdab91bc7eb554a0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// FIRESTORE DATABASE
export const db = getFirestore();

//  Custom Hook

export function useAuth() {
  const [currentUser, setCurrentUser] = React.useState();

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}
