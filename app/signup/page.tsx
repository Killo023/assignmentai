'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/ui/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, initializeFirebase, hasFirebaseConfig } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!hasFirebaseConfig) {
      setFirebaseError('Firebase is not configured. Please set up environment variables.');
      setFirebaseReady(false);
      return;
    }

    initializeFirebase().then(() => {
      setFirebaseReady(true);
      setFirebaseError(null);
    }).catch((error) => {
      setFirebaseError(error.message);
      setFirebaseReady(false);
    });
  }, []);

  const createUserProfile = async (user: any, additionalData: any = {}) => {
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || additionalData.name || user.email.split('@')[0],
      createdAt: new Date(),
      subscription: {
        plan: 'trial',
        status: 'active',
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      usage: {
        assignmentsCompleted: 0,
        assignmentsLimit: 5, // Trial limit
      },
      ...additionalData,
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const handleEmailSignUp = async (data: AuthFormData) => {
    if (!firebaseReady) {
      toast.error(firebaseError || 'Firebase is not ready. Please check configuration.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update the user's display name
      if (data.name) {
        await updateProfile(userCredential.user, {
          displayName: data.name
        });
      }

      // Create user profile in Firestore
      await createUserProfile(userCredential.user, { name: data.name });
      
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!firebaseReady) {
      toast.error(firebaseError || 'Firebase is not ready. Please check configuration.');
      return;
    }

    setLoading(true);
    try {
      if (!auth) {
        throw new Error('Authentication service not available. Please check Firebase configuration.');
      }
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Create user profile in Firestore
      await createUserProfile(userCredential.user);
      
      toast.success('Account created successfully with Google!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign up error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign up cancelled');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('Account already exists with different credentials');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups and try again.');
              } else {
          toast.error('Failed to sign up with Google. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (firebaseError) {
      return (
        <>
          <Header />
          <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4">
            <div className="w-full max-w-md text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h1>
                <p className="text-gray-600 mb-6">
                  Firebase authentication is not configured. Please set up your environment variables.
                </p>
                <div className="text-left bg-gray-100 p-4 rounded text-sm">
                  <p className="font-semibold mb-2">Required environment variables:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
                    <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                    <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                  </ul>
                </div>
                <div className="mt-6">
                  <a 
                    href="/" 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </div>
          </main>
          <Footer />
          <Toaster position="top-center" />
        </>
      );
    }

    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
          <div className="w-full max-w-md">
            <AuthForm
              type="signup"
              onSubmit={handleEmailSignUp}
              onGoogleAuth={handleGoogleSignUp}
              loading={loading || !firebaseReady}
            />
          </div>
        </main>
        <Footer />
        <Toaster position="top-center" />
      </>
    );
} 