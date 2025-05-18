// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-34379.firebaseapp.com",
  projectId: "mern-blog-34379",
  storageBucket: "mern-blog-34379.firebasestorage.app",
  messagingSenderId: "147060050783",
  appId: "1:147060050783:web:68821112ff9b1d256c44ea",
  measurementId: "G-MKZPE5F3ZK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
