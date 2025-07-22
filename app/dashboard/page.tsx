'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import FileUploader from '@/components/dashboard/FileUploader';
import AssignmentHistory from '@/components/dashboard/AssignmentHistory';
import ChatInterface from '@/components/dashboard/ChatInterface';
import UserProfile from '@/components/dashboard/UserProfile';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2, Bot, Upload, History, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';

interface Assignment {
  id: string;
  fileName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  processedContent: string;
  chatHistory?: any[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingAssignment, setProcessingAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'chat' | 'profile'>('upload');
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserData(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    }
  };

  const handleFileProcessed = async (processedFile: any) => {
    if (!user) return;

    setProcessingAssignment(true);
    try {
      const response = await fetch('/api/gemini/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: processedFile.content,
          fileName: processedFile.fileName,
          userId: user.uid,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Assignment processed successfully!');
        setActiveTab('history');
        // Refresh user data to update usage stats
        await fetchUserData(user.uid);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to process assignment');
      }
    } catch (error) {
      console.error('Error processing assignment:', error);
      toast.error('Failed to process assignment');
    } finally {
      setProcessingAssignment(false);
    }
  };

  const handleChatClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setActiveTab('chat');
  };

  const handleUpgrade = () => {
    // This would typically redirect to a payment flow
    toast.success('Upgrade feature coming soon!');
  };

  // Calculate days left in trial
  let daysLeft = null;
  if (userData?.subscription?.plan === 'trial' && userData?.subscription?.trialEndDate) {
    const trialEnd = new Date(userData.subscription.trialEndDate);
    const today = new Date();
    daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'history', label: 'History', icon: History },
    { id: 'chat', label: 'AI Chat', icon: Bot },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navbar/Header */}
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData?.displayName || user?.displayName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Transform your assignments with AI-powered assistance
          </p>
          {/* Show days left in trial if on trial plan */}
          {daysLeft !== null && (
            <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
              {daysLeft} day{daysLeft === 1 ? '' : 's'} left in your free trial
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userData?.usage?.assignmentsCompleted || 0}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Bot className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {userData?.subscription?.plan || 'Trial'}
                  </p>
                </div>
                <div className="p-3 bg-secondary-100 rounded-full">
                  <UserIcon className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(userData?.usage?.assignmentsLimit || 5) - (userData?.usage?.assignmentsCompleted || 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          {activeTab === 'upload' && (
            <FileUploader
              onFileProcessed={handleFileProcessed}
              loading={processingAssignment}
            />
          )}

          {activeTab === 'history' && user && (
            <AssignmentHistory
              userId={user.uid}
              onChatClick={handleChatClick}
            />
          )}

          {activeTab === 'chat' && selectedAssignment && (
            <ChatInterface
              assignment={selectedAssignment}
              userId={user?.uid || ''}
              onClose={() => setActiveTab('history')}
            />
          )}

          {activeTab === 'profile' && (
            <UserProfile
              userData={userData}
              onUpgrade={handleUpgrade}
            />
          )}
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Upload PDF, DOCX, or XLSX files for best results</li>
                <li>• Use the chat feature to refine your assignments</li>
                <li>• Download your processed assignments in multiple formats</li>
                <li>• Upgrade to Premium for unlimited assignments</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
} 