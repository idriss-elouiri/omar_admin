import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_URL,
  authDomain: "ecommerce-app-4f3dd.firebaseapp.com",
  projectId: "ecommerce-app-4f3dd",
  storageBucket: "ecommerce-app-4f3dd.appspot.com",
  messagingSenderId: "993257249831",
  appId: "1:993257249831:web:37f3c882320e5836e60202",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
