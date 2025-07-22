# AI Assignment Assistant - Production Setup Guide

A fullstack Next.js 14 SaaS application that helps students enhance their academic assignments using AI technology.

## 🚀 Production Features

✅ **Real Firebase Authentication** - Complete user management  
✅ **Firestore Database** - Scalable data storage  
✅ **DeepSeek AI via Hugging Face** - Advanced assignment processing  
✅ **PayPal Payments** - Subscription management  
✅ **File Processing** - PDF, DOCX, XLSX support  
✅ **Real-time Chat** - AI tutoring assistance  

## 📋 Prerequisites

Before setting up the production environment, ensure you have:

- Node.js 16+ installed
- A Firebase project
- Google Cloud project with Gemini API access
- PayPal Developer account
- Vercel account (for deployment)

## 🔧 Production Setup

### 1. Firebase Configuration

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Set up Authentication:**
   - Enable Email/Password and Google sign-in methods
   - Configure authorized domains

3. **Configure Firestore:**
   - Create Firestore database in production mode
   - Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Assignments belong to users
    match /assignments/{assignmentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

4. **Get Firebase Config:**
   - Go to Project Settings > General
   - Add a web app and copy the configuration

### 2. Google Gemini AI Setup

1. **Enable Gemini API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Generative AI API
   - Create an API key

2. **Configure API Key:**
   - Restrict the API key to your application
   - Set usage quotas as needed

### 3. PayPal Integration Setup

1. **Create PayPal App:**
   - Go to [PayPal Developer](https://developer.paypal.com/)
   - Create a new app
   - Get Client ID and Client Secret

2. **Set up Subscription Plans:**
   - Create billing plans in PayPal dashboard
   - Note the Plan IDs for configuration

3. **Configure Webhooks:**
   - Set webhook URL: `https://yourapp.com/api/payment/webhook`
   - Subscribe to these events:
     - BILLING.SUBSCRIPTION.ACTIVATED
     - BILLING.SUBSCRIPTION.CANCELLED
     - BILLING.SUBSCRIPTION.SUSPENDED
     - BILLING.SUBSCRIPTION.PAYMENT.FAILED
     - BILLING.SUBSCRIPTION.RENEWED

### 4. Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# Application URLs
NEXT_PUBLIC_BASE_URL=https://your-production-url.com
```

### 5. Database Schema

The application uses the following Firestore collections:

**Users Collection (`/users/{userId}`):**
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "User Name",
  createdAt: Timestamp,
  subscription: {
    plan: "trial" | "premium",
    status: "active" | "cancelled" | "suspended",
    subscriptionId: "paypal_subscription_id",
    trialStartDate: Timestamp,
    trialEndDate: Timestamp
  },
  usage: {
    assignmentsCompleted: 0,
    assignmentsLimit: 5 // -1 for unlimited
  }
}
```

**Assignments Collection (`/assignments/{assignmentId}`):**
```javascript
{
  userId: "user_id",
  fileName: "assignment.pdf",
  originalContent: "Original text...",
  processedContent: "Enhanced text...",
  status: "completed",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  chatHistory: [
    {
      type: "user" | "ai",
      message: "Chat message",
      timestamp: Timestamp
    }
  ]
}
```

## 🚀 Deployment

### Deploy to Vercel

1. **Connect Repository:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables:**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all the environment variables from your `.env.local`

3. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Configure Custom Domain

1. Add your custom domain in Vercel
2. Update Firebase authorized domains
3. Update PayPal webhook URL
4. Update `NEXT_PUBLIC_BASE_URL`

## 🔒 Security Considerations

1. **Firebase Security Rules:** Ensure users can only access their own data
2. **API Rate Limiting:** Implement rate limiting for API routes
3. **PayPal Webhook Verification:** Always verify webhook signatures
4. **Environment Variables:** Never commit secrets to version control
5. **HTTPS Only:** Ensure all production traffic uses HTTPS

## 📊 Monitoring & Analytics

1. **Firebase Analytics:** Track user engagement
2. **Error Monitoring:** Set up error tracking (Sentry, etc.)
3. **Performance Monitoring:** Monitor API response times
4. **Usage Analytics:** Track AI processing usage

## 🔧 Maintenance

### Regular Tasks

1. **Monitor Usage:** Check Gemini API usage and costs
2. **Update Dependencies:** Keep packages up to date
3. **Backup Data:** Regular Firestore backups
4. **Security Updates:** Monitor for security patches

### Scaling Considerations

1. **Firestore Limits:** Monitor document read/write limits
2. **Gemini API Quotas:** Set up quota alerts
3. **PayPal Webhook Processing:** Consider queue systems for high volume
4. **CDN Configuration:** Use Vercel's global CDN for performance

## 🎯 Production Checklist

- [ ] Firebase project configured with proper security rules
- [ ] Gemini API enabled with usage limits
- [ ] PayPal app configured with webhooks
- [ ] Environment variables set in production
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Error monitoring in place
- [ ] Analytics configured
- [ ] Backup strategy implemented

## 📞 Support

For production support and scaling assistance:
- Review Firebase documentation
- Check Gemini API status page
- Monitor PayPal developer resources
- Use Vercel support for deployment issues

---

Your AI Assignment Assistant is now ready for production! 🎉 