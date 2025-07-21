// Demo Firebase implementation for when environment variables are not set
export const demoAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    console.log('Demo mode: Using fallback authentication');
    setTimeout(() => callback(null), 100);
    return () => {};
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log('Demo mode: Email sign in attempted');
    throw new Error('Demo mode: Please set up Firebase environment variables for authentication');
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    console.log('Demo mode: Account creation attempted');
    throw new Error('Demo mode: Please set up Firebase environment variables for authentication');
  },
  signInWithPopup: async (provider: any) => {
    console.log('Demo mode: Google sign in attempted');
    throw new Error('Demo mode: Please set up Firebase environment variables for Google authentication');
  },
  signOut: async () => {
    console.log('Demo mode: Sign out attempted');
    return Promise.resolve();
  },
  // Additional Firebase auth properties to prevent undefined errors
  app: {
    name: 'demo-app',
    options: {}
  },
  config: {
    apiKey: 'demo-key'
  }
};

// Demo GoogleAuthProvider
export const demoGoogleAuthProvider = function() {
  console.log('Demo mode: GoogleAuthProvider created');
  return {
    addScope: () => {},
    setCustomParameters: () => {},
    providerId: 'google.com'
  };
};

export const demoDb = {
  collection: (path: string) => ({
    doc: (id?: string) => ({
      get: () => Promise.resolve({ 
        exists: () => false, 
        data: () => ({}),
        id: id || 'demo-id'
      }),
      set: (data: any) => {
        console.log('Demo mode: Document set attempted', { path, id, data });
        return Promise.resolve();
      },
      update: (data: any) => {
        console.log('Demo mode: Document update attempted', { path, id, data });
        return Promise.resolve();
      }
    }),
    add: (data: any) => {
      console.log('Demo mode: Document add attempted', { path, data });
      return Promise.resolve({ id: 'demo-id' });
    },
    where: (field: string, operator: any, value: any) => ({
      orderBy: (field: string, direction?: string) => ({
        get: () => {
          console.log('Demo mode: Query attempted', { path, field, operator, value });
          return Promise.resolve({ docs: [] });
        }
      })
    })
  })
};

export const isFirebaseConfigured = () => {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  return requiredVars.every(varName => 
    process.env[varName] && 
    process.env[varName] !== 'demo-key' && 
    process.env[varName] !== 'demo.firebaseapp.com' &&
    process.env[varName] !== 'demo-project'
  );
}; 