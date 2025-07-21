# Environment Variables Setup Guide

## Create Your `.env.local` File

Create a file named `.env.local` in your project root with the following variables:

```bash
# =============================================================================
# FIREBASE CONFIGURATION (Required for Authentication & Database)
# =============================================================================
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# =============================================================================
# GOOGLE GEMINI AI CONFIGURATION (Required for AI Processing)
# =============================================================================
GEMINI_API_KEY=your_gemini_api_key_here

# =============================================================================
# APPLICATION CONFIGURATION (Optional)
# =============================================================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step-by-Step Setup

### 1. 🔥 Firebase Setup

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** or select existing
3. **Enable Authentication:**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google sign-in
   - Add your domain to authorized domains
4. **Enable Firestore Database:**
   - Go to Firestore Database
   - Create database in production mode
5. **Get your config:**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click web icon `</>` or select existing app
   - Copy the config values

### 2. 🤖 Google Gemini AI Setup

1. **Go to [Google AI Studio](https://makersuite.google.com/app/apikey)**
2. **Create a new API key**
3. **Copy the API key value**

### 3. 🚀 Vercel Deployment Setup

**In your Vercel dashboard:**

1. Go to your project
2. Click **Settings** > **Environment Variables**
3. Add these variables one by one:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key | Required for auth |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com | Required for auth |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id | Required for auth |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com | Required for storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | Required for messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID | Required for analytics |
| `GEMINI_API_KEY` | Your Gemini API key | Required for AI features |

4. **Redeploy** your application

## Example `.env.local` Template

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_actual_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmentai-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmentai-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmentai-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# AI Configuration
GEMINI_API_KEY=AIzaSyB...your_gemini_key

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Verification

After setting up:

1. **Local Development:** Run `npm run dev` and test login/signup
2. **Production:** Check your deployed site's authentication
3. **AI Features:** Test file upload and processing

## Troubleshooting

- **"API key not valid"**: Double-check your Firebase API key
- **"Auth domain error"**: Ensure your domain is in Firebase authorized domains
- **"Demo mode" messages**: Environment variables not set properly
- **Build errors**: All browser-accessible variables must start with `NEXT_PUBLIC_`

## Security Notes

- ✅ Never commit `.env.local` to git (it's in .gitignore)
- ✅ `NEXT_PUBLIC_*` variables are safe to expose to browsers
- ✅ `GEMINI_API_KEY` (without NEXT_PUBLIC) stays server-side only
- ✅ Firebase config values are safe to be public (they're meant for browsers) 