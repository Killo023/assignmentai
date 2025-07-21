'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Crown, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { getTrialDaysRemaining } from '@/lib/payments';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface UserData {
  displayName: string;
  email: string;
  subscription: {
    plan: string;
    status: string;
    trialStartDate: any;
    trialEndDate: any;
  };
  usage: {
    assignmentsCompleted: number;
    assignmentsLimit: number;
  };
}

interface UserProfileProps {
  userData: UserData | null;
  onUpgrade: () => void;
}

export default function UserProfile({ userData, onUpgrade }: UserProfileProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!userData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isTrialUser = userData.subscription.plan === 'trial';
  const trialDaysRemaining = isTrialUser 
    ? getTrialDaysRemaining(userData.subscription.trialStartDate.toDate())
    : 0;

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userData.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{userData.displayName}</h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isTrialUser ? (
                  <Calendar className="w-4 h-4 text-orange-500" />
                ) : (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
                <span className="font-medium">
                  {isTrialUser ? 'Free Trial' : 'Premium'}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                userData.subscription.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {userData.subscription.status}
              </span>
            </div>

            {isTrialUser && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {trialDaysRemaining > 0 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">
                        {trialDaysRemaining} days remaining
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-red-700">Trial expired</span>
                    </>
                  )}
                </div>
                
                {trialDaysRemaining <= 3 && trialDaysRemaining > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Trial ending soon!</span>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">
                      Upgrade to continue accessing all features
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Usage Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Usage</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assignments completed</span>
                <span className="font-medium">
                  {userData.usage.assignmentsCompleted}
                  {isTrialUser && ` / ${userData.usage.assignmentsLimit}`}
                </span>
              </div>
              
              {isTrialUser && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (userData.usage.assignmentsCompleted / userData.usage.assignmentsLimit) * 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Upgrade Banner */}
          {isTrialUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Upgrade to Premium</span>
              </div>
              <p className="text-sm text-white/90 mb-3">
                Unlock unlimited assignments, advanced AI features, and priority support
              </p>
              <Button
                onClick={onUpgrade}
                variant="secondary"
                size="sm"
                className="w-full bg-white text-primary-600 hover:bg-gray-100"
              >
                Upgrade Now - $49.99/month
              </Button>
            </motion.div>
          )}

          {/* Sign Out */}
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
} 