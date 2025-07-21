'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/ui/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { initializeFirebase } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initializeFirebase().then(() => {
      setFirebaseReady(true);
    }).catch(() => {
      setFirebaseReady(true); // Continue with demo mode
    });
  }, []);

  const handleEmailSignIn = async (data: AuthFormData) => {
    if (!firebaseReady) {
      toast.error('System is initializing. Please wait...');
      return;
    }

    setLoading(true);
    try {
      // Dynamic import to avoid build issues
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later.');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseReady) {
      toast.error('System is initializing. Please wait...');
      return;
    }

    setLoading(true);
    try {
      // Dynamic import to avoid build issues
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups and try again.');
      } else {
        toast.error('Failed to sign in with Google');
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
            type="signin"
            onSubmit={handleEmailSignIn}
            onGoogleAuth={handleGoogleSignIn}
            loading={loading || !firebaseReady}
          />
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </>
  );
} 