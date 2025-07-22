// Production Firebase configuration - Works on both client and server
import { debugFirebaseConfig } from './firebase-debug';

let auth: any;
let db: any;
let isInitialized = false;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug configuration in development
if (process.env.NODE_ENV === 'development' || typeof window !== 'undefined') {
  debugFirebaseConfig();
}

// Check if Firebase config exists
const hasFirebaseConfig = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// Dynamic import to avoid build-time issues
async function initializeFirebase() {
  if (!hasFirebaseConfig) {
    throw new Error('Firebase environment variables not configured. Please set up Firebase credentials in your environment variables.');
  }

  if (isInitialized) {
    return { auth, db };
  }

  try {
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');

    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);
    isInitialized = true;
    
    console.log('🔥 Firebase initialized successfully');
    return { auth, db };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw new Error(`Firebase initialization failed: ${error}`);
  }
}

// Initialize Firebase for both client and server
if (hasFirebaseConfig) {
  initializeFirebase().catch(error => {
    console.error('❌ Firebase initialization error:', error);
  });
} else {
  console.error('⚠️ Firebase environment variables not found. Please configure Firebase in your deployment settings.');
}

// Export function to ensure Firebase is initialized before use
export async function ensureFirebaseInitialized() {
  if (!isInitialized) {
    await initializeFirebase();
  }
  return { auth, db };
}

export { auth, db, initializeFirebase, hasFirebaseConfig };

export default {
  name: 'ai-assignment-app'
}; 