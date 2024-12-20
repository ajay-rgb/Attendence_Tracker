import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDcogJEZLEYEUee_OyLCrveR_JEIBMHl-o",
  authDomain: "class-performance.firebaseapp.com",
  projectId: "class-performance",
  storageBucket: "class-performance.firebasestorage.app",
  messagingSenderId: "952489208335",
  appId: "1:952489208335:web:110191cb69c413d74cd17a",
  measurementId: "G-S77ZN222D0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);