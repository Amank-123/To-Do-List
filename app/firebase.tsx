// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAA3fqkau3gZ8r213FE1l6TteTUb-Vp4Jw",
  authDomain: "mytodo-15f56.firebaseapp.com",
  projectId: "mytodo-15f56",
  storageBucket: "mytodo-15f56.firebasestorage.app",
  messagingSenderId: "991166186793",
  appId: "1:991166186793:web:00a729980639171feae338",
  measurementId: "G-7KL7J18EY0",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
