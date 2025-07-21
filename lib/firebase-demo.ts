// Demo Firebase implementation for development
// This avoids the undici compatibility issues while maintaining the same API

export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Simulate no user initially
    setTimeout(() => callback(null), 100);
    return () => {}; // Unsubscribe function
  }
};

export const db = {
  // Mock Firestore implementation
};

// For compatibility
export default {
  name: 'demo-app'
}; 