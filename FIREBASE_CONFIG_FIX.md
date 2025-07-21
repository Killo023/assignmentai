# 🔥 Fix Firebase Configuration Error

## ❌ Error: `auth/configuration-not-found`

This error occurs when Firebase can't find your project configuration. Here's how to fix it:

## 🚀 **IMMEDIATE FIX (Choose One):**

### Option A: Fix on Vercel (Recommended for Production)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Select your project: `assignmentai`**
3. **Go to Settings → Environment Variables**
4. **Add these 6 variables:**

```bash
# Variable Name: NEXT_PUBLIC_FIREBASE_API_KEY
# Value: Your Firebase API key (starts with AIzaSy...)

# Variable Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# Value: your-project-id.firebaseapp.com

# Variable Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
# Value: your-project-id

# Variable Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
# Value: your-project-id.appspot.com

# Variable Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
# Value: your numeric sender ID

# Variable Name: NEXT_PUBLIC_FIREBASE_APP_ID
# Value: your app ID (starts with 1:...)
```

5. **Redeploy** your app (Settings → Deployments → Redeploy)

### Option B: Get Firebase Config (If You Don't Have It)

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create new project** or select existing
3. **Click gear icon (⚙️) → Project Settings**
4. **Scroll down to "Your apps" section**
5. **If no web app exists:**
   - Click `</>` (Add web app)
   - Give it a name: "AssignmentAI"
   - Click "Register app"
6. **Copy the config values:**

```javascript
// You'll see something like this:
const firebaseConfig = {
  apiKey: "AIzaSyC4XYZ...",           // Copy this
  authDomain: "project-123.firebaseapp.com",  // Copy this  
  projectId: "project-123",          // Copy this
  storageBucket: "project-123.appspot.com",   // Copy this
  messagingSenderId: "123456789",    // Copy this
  appId: "1:123456789:web:abc123"    // Copy this
};
```

## 🔧 **ENABLE REQUIRED SERVICES:**

### 1. Enable Authentication
1. **In Firebase Console** → Authentication
2. **Click "Get Started"**
3. **Go to "Sign-in method" tab**
4. **Enable these providers:**
   - ✅ **Email/Password** (click enable)
   - ✅ **Google** (click enable, add your email)
5. **Add your domain** to authorized domains:
   - Add: `your-vercel-app.vercel.app`
   - Add: `localhost` (for local testing)

### 2. Enable Firestore Database
1. **In Firebase Console** → Firestore Database
2. **Click "Create database"**
3. **Choose "Start in production mode"**
4. **Select a location** (choose closest to your users)

## 🧪 **TEST THE FIX:**

### After adding environment variables:

1. **Visit your deployed site**
2. **Open browser console** (F12)
3. **Look for debug output:**
   ```
   🔍 Firebase Configuration Debug:
   ✅ apiKey: AIzaSyC4XYZ...
   ✅ authDomain: project-123.firebaseapp.com
   ✅ projectId: project-123
   ✅ storageBucket: project-123.appspot.com
   ✅ messagingSenderId: 123456789
   ✅ appId: 1:123456789:web:abc123
   ```

4. **Test authentication:**
   - Go to `/login`
   - Try Google sign-in
   - Should work without errors!

## 🚨 **TROUBLESHOOTING:**

### If you still get errors:

**Error: "API key not valid"**
- ✅ Double-check your API key in Firebase Console
- ✅ Make sure it starts with `AIzaSy`

**Error: "Auth domain error"**
- ✅ Add your Vercel domain to Firebase authorized domains
- ✅ Format: `your-app-name.vercel.app`

**Error: "Project not found"**
- ✅ Verify project ID matches exactly
- ✅ Ensure project exists in Firebase Console

**Still shows "Configuration Required" page**
- ✅ Environment variables not set properly
- ✅ Redeploy after adding variables
- ✅ Check variable names are exactly: `NEXT_PUBLIC_FIREBASE_*`

## 📋 **QUICK CHECKLIST:**

- [ ] Firebase project created
- [ ] Authentication enabled (Email + Google)
- [ ] Firestore database created
- [ ] Got all 6 config values from Firebase
- [ ] Added all 6 environment variables to Vercel
- [ ] Redeployed the application
- [ ] Added your domain to Firebase authorized domains

## 🎉 **SUCCESS INDICATORS:**

When everything works:
- ✅ No "Configuration Required" page
- ✅ Google sign-in button works
- ✅ Email/password login works
- ✅ Users can create accounts
- ✅ No console errors about Firebase

---

**Need help?** Check the console logs for specific error messages and follow the troubleshooting steps above. 