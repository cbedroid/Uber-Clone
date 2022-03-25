/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCCdT8FWzO4ygT5xsZ5ylos_k1GKuwAdT4",
  authDomain: "uber-clone-ef29f.firebaseapp.com",
  projectId: "uber-clone-ef29f",
  storageBucket: "uber-clone-ef29f.appspot.com",
  messagingSenderId: "629360553355",
  appId: "1:629360553355:web:edb2a054689cb8f4fb138e",
};

// Initialize Firebase
const apps = getApps();
let app = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
auth.useDeviceLanguage();

export default app;
export { auth };
