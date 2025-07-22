'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/ui/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setFirebaseReady(true);
    setFirebaseError(null);
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