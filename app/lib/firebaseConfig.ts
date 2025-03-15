import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAsSdaRXxDWN1riLMkiGRYp9ENg-XZeKQw",
    authDomain: "nextjs-dashboard-7e368.firebaseapp.com",
    projectId: "nextjs-dashboard-7e368",
    storageBucket: "nextjs-dashboard-7e368.firebasestorage.app",
    messagingSenderId: "897276541576",
    appId: "1:897276541576:web:a009e7f696e88028e1fd3d",
    measurementId: "G-5TQ528Z92L"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
