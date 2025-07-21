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
  }
};

export const demoDb = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: () => false, data: () => ({}) }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve()
    }),
    add: () => Promise.resolve({ id: 'demo-id' }),
    where: () => ({
      orderBy: () => ({
        get: () => Promise.resolve({ docs: [] })
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