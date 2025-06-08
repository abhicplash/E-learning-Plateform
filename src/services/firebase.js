import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBxm1JC6WlmAB26QLvC338qKaq7d9R7fs",
  authDomain: "e-learning-260fe.firebaseapp.com",
  projectId: "e-learning-260fe",
  storageBucket: "e-learning-260fe.firebasestorage.app",
  messagingSenderId: "696056601072",
  appId: "1:696056601072:web:7fc6b2f49038ada8a1e535",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
