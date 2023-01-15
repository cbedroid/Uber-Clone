/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
// eslint-disable-next-line import/no-unresolved
// import { process.env.REACT_APP_FIREBASE_APIKEY, process.env.REACT_APP_FIREBASE_AUTHDOMAIN, process.env.REACT_APP_FIREBASE_PROJECTID, process.env.REACT_APP_FIREBASE_STORAGEBUCKET, process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID, process.env.REACT_APP_FIREBASE_APPID } from "@env";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

// Initialize Firebase
const apps = getApps();
const app = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

auth.useDeviceLanguage();

export default app;
export { auth };
