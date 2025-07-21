// Production Firebase configuration
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

// Check if basic Firebase config exists (less strict check)
const hasFirebaseConfig = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// Dynamic import to avoid build-time issues
async function initializeFirebase() {
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
    
    console.log('Firebase initialized successfully in production mode');
    return { auth, db };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error; // Don't fall back to demo mode, let the error surface
  }
}

// Initialize Firebase immediately for client-side
if (typeof window !== 'undefined' && hasFirebaseConfig) {
  initializeFirebase().catch(error => {
    console.error('Failed to initialize Firebase:', error);
    // In production, we want to know about Firebase failures
  });
} else if (typeof window !== 'undefined') {
  console.error('Firebase environment variables not configured. Please check your setup.');
}

export { auth, db, initializeFirebase, hasFirebaseConfig };

export default {
  name: 'ai-assignment-app-production'
}; 