import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_URL,
  authDomain: "next-real-estate-c2ab0.firebaseapp.com",
  projectId: "next-real-estate-c2ab0",
  storageBucket: "next-real-estate-c2ab0.appspot.com",
  messagingSenderId: "278868693447",
  appId: "1:278868693447:web:446e8bf3c2ebc1d63989e2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);