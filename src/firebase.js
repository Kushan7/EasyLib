// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_ug0BeWXXaJ0bub6IlJm-4MQbKNFi1bM",
  authDomain: "easylib-c9ba3.firebaseapp.com",
  databaseURL: "https://easylib-c9ba3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "easylib-c9ba3",
  storageBucket: "easylib-c9ba3.firebasestorage.app",
  messagingSenderId: "457259066657",
  appId: "1:457259066657:web:117f9ab6525333355a4a60",
  measurementId: "G-CQE7LC86GV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);