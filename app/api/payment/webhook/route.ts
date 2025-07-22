import { NextRequest, NextResponse } from 'next/server';
import { verifyPayPalWebhook } from '@/lib/paypal';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    // Verify webhook signature for security
    const isValid = await verifyPayPalWebhook(headers, body);
    
    if (!isValid) {
      console.error('Invalid PayPal webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;
    const resource = event.resource;

    console.log('PayPal webhook received:', eventType, resource.id);

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(db, resource);
        break;
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(db, resource);
        break;
      
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(db, resource);
        break;
      
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
        await handlePaymentFailed(db, resource);
        break;
      
      case 'BILLING.SUBSCRIPTION.RENEWED':
        await handleSubscriptionRenewed(db, resource);
        break;
      
      default:
        console.log('Unhandled webhook event type:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(db: any, subscription: any) {
  try {
    // Find user by subscription ID
    const userId = await findUserBySubscriptionId(db, subscription.id);
    
    if (!userId) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      subscription: {
        plan: 'premium',
        status: 'active',
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        startDate: new Date(subscription.start_time),
        nextBillingTime: new Date(subscription.billing_info?.next_billing_time),
      },
      usage: {
        assignmentsCompleted: 0,
        assignmentsLimit: -1, // Unlimited for premium
      },
      pendingSubscription: null, // Clear pending subscription
      updatedAt: new Date(),
    });

    console.log('Subscription activated for user:', userId);
  } catch (error) {
    console.error('Error handling subscription activation:', error);
  }
}

async function handleSubscriptionCancelled(db: any, subscription: any) {
  try {
    const userId = await findUserBySubscriptionId(db, subscription.id);
    
    if (!userId) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'subscription.status': 'cancelled',
      'subscription.cancelledAt': new Date(),
      updatedAt: new Date(),
    });

    console.log('Subscription cancelled for user:', userId);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handleSubscriptionSuspended(db: any, subscription: any) {
  try {
    const userId = await findUserBySubscriptionId(db, subscription.id);
    
    if (!userId) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'subscription.status': 'suspended',
      'subscription.suspendedAt': new Date(),
      updatedAt: new Date(),
    });

    console.log('Subscription suspended for user:', userId);
  } catch (error) {
    console.error('Error handling subscription suspension:', error);
  }
}

async function handlePaymentFailed(db: any, resource: any) {
  try {
    const subscriptionId = resource.billing_agreement_id;
    const userId = await findUserBySubscriptionId(db, subscriptionId);
    
    if (!userId) {
      console.error('User not found for subscription:', subscriptionId);
      return;
    }

    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'subscription.status': 'payment_failed',
      'subscription.lastPaymentFailure': new Date(),
      updatedAt: new Date(),
    });

    console.log('Payment failed for user:', userId);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleSubscriptionRenewed(db: any, subscription: any) {
  try {
    const userId = await findUserBySubscriptionId(db, subscription.id);
    
    if (!userId) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'subscription.status': 'active',
      'subscription.lastRenewal': new Date(),
      'subscription.nextBillingTime': new Date(subscription.billing_info?.next_billing_time),
      updatedAt: new Date(),
    });

    console.log('Subscription renewed for user:', userId);
  } catch (error) {
    console.error('Error handling subscription renewal:', error);
  }
}

async function findUserBySubscriptionId(db: any, subscriptionId: string): Promise<string | null> {
  try {
    // In a real implementation, you'd query Firestore to find the user
    // For now, we'll implement a simple search
    // This is not efficient for large datasets - consider using a separate index
    
    // Note: This is a simplified implementation
    // In production, you should maintain a separate collection for subscription mapping
    // or use Firestore's compound queries more efficiently
    
    return null; // Placeholder - implement proper user lookup
  } catch (error) {
    console.error('Error finding user by subscription ID:', error);
    return null;
  }
} 