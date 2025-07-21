export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    interval: 'monthly',
    features: [
      '7-day free trial',
      'Up to 5 assignments',
      'Basic AI processing',
      'PDF download only'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    interval: 'monthly',
    features: [
      'Unlimited assignments',
      'Advanced AI processing',
      'All format downloads (PDF, DOCX, XLSX)',
      'Priority support',
      'Chat with AI for refinements',
      'Assignment history'
    ]
  }
];

export async function createPayPalSubscription(planId: string, userId: string) {
  try {
    const response = await fetch('/api/payment/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch('/api/payment/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export function isTrialExpired(trialStartDate: Date): boolean {
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 7);
  return new Date() > trialEndDate;
}

export function getTrialDaysRemaining(trialStartDate: Date): number {
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 7);
  const diffTime = trialEndDate.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
} 