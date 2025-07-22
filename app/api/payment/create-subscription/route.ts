import { NextRequest, NextResponse } from 'next/server';
import { createPayPalSubscription } from '@/lib/paypal';
import { doc, updateDoc } from 'firebase/firestore';
import { ensureFirebaseInitialized } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      );
    }

    // Ensure Firebase is initialized
    const { db } = await ensureFirebaseInitialized();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not properly configured' },
        { status: 500 }
      );
    }

    // Create PayPal subscription
    const subscription = await createPayPalSubscription(planId, userId);

    // Update user record with pending subscription
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      pendingSubscription: {
        subscriptionId: subscription.subscriptionId,
        planId,
        status: 'pending',
        createdAt: new Date(),
      }
    });

    return NextResponse.json({
      subscriptionId: subscription.subscriptionId,
      approvalUrl: subscription.approvalUrl,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 