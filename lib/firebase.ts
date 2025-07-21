// Firebase configuration with compatibility workaround
let auth: any;
let db: any;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '12345',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:12345:web:abc123',
};

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
    
    return { auth, db };
  } catch (error) {
    console.warn('Firebase initialization failed, using demo mode:', error);
    
    // Fallback to demo implementation
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback: (user: any) => void) => {
        setTimeout(() => callback(null), 100);
        return () => {};
      }
    };
    
    db = {};
    
    return { auth, db };
  }
}

// Initialize Firebase immediately if possible
if (typeof window !== 'undefined') {
  initializeFirebase().catch(console.error);
} else {
  // Server-side fallback
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: any) => void) => {
      setTimeout(() => callback(null), 100);
      return () => {};
    }
  };
  db = {};
}

export { auth, db };
export { initializeFirebase };

export default {
  name: 'ai-assignment-app'
}; 