// PayPal payment processing utilities

export interface PayPalPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export const PAYPAL_PLANS: PayPalPlan[] = [
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    description: 'Unlimited assignments and premium features',
    price: 49.99,
    interval: 'month',
    features: [
      'Unlimited assignments',
      'AI chat support',
      'Priority processing',
      'Advanced AI models',
      'Export to all formats',
      'Email support'
    ]
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    description: 'Best value - save 20% with annual billing',
    price: 479.99,
    interval: 'year',
    features: [
      'Everything in Monthly',
      'Save 20% annually',
      'Priority customer support',
      'Early access to new features',
      'Extended usage analytics',
      'Team collaboration tools'
    ]
  }
];

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Create PayPal subscription
export async function createPayPalSubscription(planId: string, userId: string) {
  try {
    const accessToken = await getPayPalAccessToken();
    const plan = PAYPAL_PLANS.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    // Create subscription request
    const subscriptionData = {
      plan_id: planId,
      subscriber: {
        name: {
          given_name: 'User',
          surname: 'Name'
        },
        email_address: `user-${userId}@example.com` // In production, use real email
      },
      application_context: {
        brand_name: 'AssignmentAI',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=cancelled`
      }
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(subscriptionData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal API error: ${error}`);
    }

    const subscription = await response.json();
    
    // Find the approval URL
    const approvalUrl = subscription.links?.find((link: any) => link.rel === 'approve')?.href;
    
    return {
      subscriptionId: subscription.id,
      approvalUrl,
      status: subscription.status
    };
  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    throw error;
  }
}

// Cancel PayPal subscription
export async function cancelPayPalSubscription(subscriptionId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        reason: 'User requested cancellation'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal cancellation error: ${error}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling PayPal subscription:', error);
    throw error;
  }
}

// Get subscription details
export async function getPayPalSubscriptionDetails(subscriptionId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal API error: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting PayPal subscription details:', error);
    throw error;
  }
}

// Verify PayPal webhook signature (for webhook security)
export async function verifyPayPalWebhook(headers: any, body: string): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const verificationData = {
      auth_algo: headers['paypal-auth-algo'],
      cert_id: headers['paypal-cert-id'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body)
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(verificationData)
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying PayPal webhook:', error);
    return false;
  }
} 