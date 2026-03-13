import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * [IMPORTANT] Replace the configuration below with your Firebase project settings.
 * You can find this in the Firebase Console: Project Settings > General > Your apps.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAkIs_z5HYaPVL10iMS5f-778cdFAQr-hA",
  authDomain: "sbcastrology-3868b.firebaseapp.com",
  projectId: "sbcastrology-3868b",
  storageBucket: "sbcastrology-3868b.firebasestorage.app",
  messagingSenderId: "863143539268",
  appId: "1:863143539268:web:f663f3cb4666c158b20211",
  measurementId: "G-CT20GD4BTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
