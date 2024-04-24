// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "test-admincp.firebaseapp.com",
  projectId: "test-admincp",
  storageBucket: "test-admincp.appspot.com",
  messagingSenderId: "331001905799",
  appId: "1:331001905799:web:0f3171396d384e03546e22",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
