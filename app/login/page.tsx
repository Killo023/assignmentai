'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm, { AuthFormData } from '@/components/ui/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { initializeFirebase, hasFirebaseConfig } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
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

  const handleEmailSignIn = async (data: AuthFormData) => {
    if (!firebaseReady) {
      toast.error(firebaseError || 'Firebase is not ready. Please check configuration.');
      return;
    }

    setLoading(true);
    try {
      // Dynamic import to avoid build issues
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      if (!auth) {
        throw new Error('Authentication service not available. Please check Firebase configuration.');
      }
      
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
        toast.error('Failed to sign in. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseReady) {
      toast.error(firebaseError || 'Firebase is not ready. Please check configuration.');
      return;
    }

    setLoading(true);
    try {
      // Dynamic import to avoid build issues
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      if (!auth) {
        throw new Error('Authentication service not available. Please check Firebase configuration.');
      }
      
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
        toast.error('Failed to sign in with Google. Please try again.');
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