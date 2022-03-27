/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
// eslint-disable-next-line import/no-unresolved
import { FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN, FIREBASE_PROJECTID, FIREBASE_STORAGEBUCKET, FIREBASE_MESSAGINGSENDERID, FIREBASE_APPID } from "@env";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APPID,
};

// Initialize Firebase
const apps = getApps();
let app = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

auth.useDeviceLanguage();

export default app;
export { auth };
