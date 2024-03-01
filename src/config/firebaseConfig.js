// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyDiy2mtvpU6oLGmtYdy3EM25i9aXDTntbI",
  authDomain: "aicerts.firebaseapp.com",
  projectId: "aicerts",
  storageBucket: "aicerts.appspot.com",
  messagingSenderId: "2048503843",
  appId: "1:2048503843:web:4ba5ae571cf7492ed3c196",
  measurementId: "G-5GR7ZXL174"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}