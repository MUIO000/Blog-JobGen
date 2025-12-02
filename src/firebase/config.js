// Firebase Configuration
// Replace these values with your Firebase project configuration
// You can find these in your Firebase Console > Project Settings

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// Uses environment variables if available, otherwise falls back to defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBlgEyV5X6T46S83p1mlv1tkCoSnUxO5P0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jobgen-blog.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jobgen-blog",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jobgen-blog.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1083925070058",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1083925070058:web:0f57a29e9b1895d3fc1793",
  measurementId: "G-5NWGX05E5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
