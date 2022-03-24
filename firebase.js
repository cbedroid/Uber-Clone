/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW4XX5OPIH2AB24k08SxfL_9Fn4UK0DYQ",
  authDomain: "uber-clone-342107.firebaseapp.com",
  projectId: "uber-clone-342107",
  storageBucket: "uber-clone-342107.appspot.com",
  messagingSenderId: "556992996945",
  appId: "1:556992996945:web:c569e48d817b651239ba70",
};

// Initialize Firebase
const apps = getApps();
let app = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export default app;
