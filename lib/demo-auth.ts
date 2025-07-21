// Demo authentication system - replace with Firebase when ready
export interface DemoUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface DemoAuthState {
  user: DemoUser | null;
  loading: boolean;
}

// Simple event emitter for auth state changes
class DemoAuthEmitter {
  private listeners: ((user: DemoUser | null) => void)[] = [];
  private currentUser: DemoUser | null = null;

  subscribe(listener: (user: DemoUser | null) => void) {
    this.listeners.push(listener);
    // Call immediately with current state
    listener(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  setUser(user: DemoUser | null) {
    this.currentUser = user;
    this.listeners.forEach(listener => listener(user));
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

const authEmitter = new DemoAuthEmitter();

export const demoAuth = {
  // Sign in with email and password
  signInWithEmailAndPassword: async (email: string, password: string): Promise<{ user: DemoUser }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: DemoUser = {
      uid: 'demo-user-' + Date.now(),
      email,
      displayName: email.split('@')[0],
    };
    
    authEmitter.setUser(user);
    return { user };
  },

  // Create user with email and password
  createUserWithEmailAndPassword: async (email: string, password: string): Promise<{ user: DemoUser }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: DemoUser = {
      uid: 'demo-user-' + Date.now(),
      email,
      displayName: email.split('@')[0],
    };
    
    authEmitter.setUser(user);
    return { user };
  },

  // Sign in with Google (demo)
  signInWithPopup: async (): Promise<{ user: DemoUser }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: DemoUser = {
      uid: 'demo-google-user-' + Date.now(),
      email: 'demo@gmail.com',
      displayName: 'Demo User',
      photoURL: 'https://via.placeholder.com/150',
    };
    
    authEmitter.setUser(user);
    return { user };
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    authEmitter.setUser(null);
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: DemoUser | null) => void) => {
    return authEmitter.subscribe(callback);
  },

  // Get current user
  getCurrentUser: () => {
    return authEmitter.getCurrentUser();
  }
};

// Demo database
export interface DemoUserData {
  uid: string;
  email: string;
  displayName: string;
  subscriptionType: 'trial' | 'premium';
  subscriptionId?: string;
  trialStartDate: string;
  assignmentCount: number;
  maxAssignments: number;
  createdAt: string;
}

const demoUsers: Record<string, DemoUserData> = {};
const demoAssignments: Record<string, any[]> = {};

export const demoDb = {
  // Create user document
  setDoc: async (path: string, data: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (path.includes('users/')) {
      const uid = path.split('/')[1];
      demoUsers[uid] = data;
    }
  },

  // Get user document
  getDoc: async (path: string): Promise<{ exists: () => boolean; data: () => any }> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (path.includes('users/')) {
      const uid = path.split('/')[1];
      const userData = demoUsers[uid];
      return {
        exists: () => !!userData,
        data: () => userData
      };
    }
    
    return {
      exists: () => false,
      data: () => null
    };
  },

  // Add assignment
  addDoc: async (collection: string, data: any): Promise<{ id: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const id = 'demo-assignment-' + Date.now();
    if (!demoAssignments[data.userId]) {
      demoAssignments[data.userId] = [];
    }
    demoAssignments[data.userId].push({ id, ...data });
    
    return { id };
  },

  // Get assignments
  getDocs: async (userId: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return demoAssignments[userId] || [];
  },

  // Update document
  updateDoc: async (path: string, data: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (path.includes('users/')) {
      const uid = path.split('/')[1];
      if (demoUsers[uid]) {
        demoUsers[uid] = { ...demoUsers[uid], ...data };
      }
    }
  }
}; 