// Production Firebase configuration - Synchronous client-side initialization
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug log for Firebase config
console.log('Initializing Firebase with config:', firebaseConfig);

// Guard: throw error if any required config is missing
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error('Missing required Firebase configuration. Please check your environment variables.');
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
console.log('Firebase app initialized:', app.name);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default {
  name: 'ai-assignment-app',
}; 