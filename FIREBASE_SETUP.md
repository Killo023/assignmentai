# Firebase Setup Guide

## Required Environment Variables

To enable authentication and database functionality, you need to set up Firebase environment variables in your Vercel deployment.

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enable Authentication and Firestore Database

### 2. Get Your Firebase Configuration

1. In your Firebase project, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web app icon `</>` or create a new web app
4. Copy the configuration values

### 3. Set Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** sign-in
4. Add your domain to authorized domains

### 5. Set Up Firestore Database

1. Go to **Firestore Database**
2. Create database in production mode
3. Set up security rules as needed

## Demo Mode

If Firebase environment variables are not configured, the app will run in demo mode with:
- Mock authentication (login/signup buttons will show helpful error messages)
- Mock database operations
- All functionality available except actual data persistence

## Troubleshooting

- **API Key Error**: Make sure `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly
- **Auth Domain Error**: Ensure your domain is added to Firebase authorized domains
- **Build Errors**: All environment variables must start with `NEXT_PUBLIC_` to be available in the browser 