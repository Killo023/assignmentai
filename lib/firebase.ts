import { demoAuth, demoDb, isFirebaseConfigured } from './firebase-demo';

// Firebase configuration with validation
let auth: any;
let db: any;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const hasValidFirebaseConfig = isFirebaseConfigured();

// Dynamic import to avoid build-time issues
async function initializeFirebase() {
  if (!hasValidFirebaseConfig) {
    console.warn('Firebase environment variables not configured. Using demo mode.');
    auth = demoAuth;
    db = demoDb;
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
    
    console.log('Firebase initialized successfully');
    return { auth, db };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.warn('Falling back to demo mode');
    
    // Fallback to demo implementation
    auth = demoAuth;
    db = demoDb;
    
    return { auth, db };
  }
}

// Initialize Firebase
if (typeof window !== 'undefined') {
  initializeFirebase().catch(console.error);
} else {
  // Server-side initialization
  if (hasValidFirebaseConfig) {
    // Will be initialized on client-side
    auth = null;
    db = null;
  } else {
    auth = demoAuth;
    db = demoDb;
  }
}

export { auth, db };
export { initializeFirebase };

export default {
  name: 'ai-assignment-app'
}; 