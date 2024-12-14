import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_URL,
  authDomain: "full-stack-real-estate-425912.firebaseapp.com",
  projectId: "full-stack-real-estate-425912",
  storageBucket: "full-stack-real-estate-425912.appspot.com",
  messagingSenderId: "925217467678",
  appId: "1:925217467678:web:7c3bbd985f2380cbd4ad0f",
};

export const app = initializeApp(firebaseConfig);
