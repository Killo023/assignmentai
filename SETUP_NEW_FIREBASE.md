# 🔥 Create New Firebase Project for AssignmentAI

## Current Issue
Your Firebase API key `AIzaSyDgFAyaMWV--UqywRkfNuF6f7uD5ceiY2Y` is returning `CONFIGURATION_NOT_FOUND`, which means the project either doesn't exist or is misconfigured.

## 🚀 **SOLUTION: Create Fresh Firebase Project**

### **Step 1: Create New Firebase Project**

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Project name:** `AssignmentAI` (or any name you prefer)
4. **Project ID:** Will be auto-generated (like `assignmentai-12345`)
5. **Analytics:** You can disable for now
6. **Click "Create project"**

### **Step 2: Add Web App**

1. **In your new project, click the web icon `</>`**
2. **App nickname:** `AssignmentAI Web`
3. **✅ Check "Also set up Firebase Hosting"** (optional)
4. **Click "Register app"**
5. **Copy the config object** - you'll need this!

```javascript
// Example of what you'll see:
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "assignmentai-12345.firebaseapp.com",
  projectId: "assignmentai-12345",
  storageBucket: "assignmentai-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### **Step 3: Enable Authentication**

1. **Go to Authentication** in left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable Email/Password:**
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. **Enable Google Sign-in:**
   - Click "Google"
   - Toggle "Enable"
   - **Project support email:** Use your Gmail
   - Click "Save"

### **Step 4: Enable Firestore Database**

1. **Go to Firestore Database** in left sidebar
2. **Click "Create database"**
3. **Choose "Start in production mode"**
4. **Select location:** Choose closest to your users (e.g., `us-central1`)
5. **Click "Done"**

### **Step 5: Configure Authorized Domains**

1. **In Authentication → Settings tab**
2. **Scroll to "Authorized domains"**
3. **Add your Vercel domain:**
   - Click "Add domain"
   - Enter: `your-app-name.vercel.app` (replace with your actual Vercel URL)
   - Click "Add"

### **Step 6: Add Environment Variables to Vercel**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Select your `assignmentai` project**
3. **Settings → Environment Variables**
4. **Add these 6 variables with your NEW values:**

```bash
# Use the values from your NEW Firebase config:

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmentai-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmentai-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmentai-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

### **Step 7: Redeploy Your App**

1. **In Vercel Dashboard:**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Wait for deployment to complete

### **Step 8: Test Your App**

1. **Visit your deployed app**
2. **Open browser console (F12)**
3. **Should see:**
   ```
   🔍 Firebase Configuration Debug:
   ✅ apiKey: AIzaSyBxxxxxxx...
   ✅ authDomain: assignmentai-12345.firebaseapp.com
   ✅ projectId: assignmentai-12345
   ✅ All Firebase environment variables are present
   ```

4. **Test authentication:**
   - Go to `/login`
   - Try **Google sign-in** - should work!
   - Try **Email/Password** signup - should work!

## 🎯 **Expected Results After Setup:**

✅ **No more `CONFIGURATION_NOT_FOUND` errors**  
✅ **Google sign-in works**  
✅ **Email/password authentication works**  
✅ **User accounts are created in Firebase**  
✅ **Database operations work**  

## 🚨 **Troubleshooting:**

**If you still get errors:**

1. **Double-check environment variable names** (must start with `NEXT_PUBLIC_FIREBASE_`)
2. **Verify all 6 variables are set** in Vercel
3. **Ensure you redeployed** after adding variables
4. **Check Firebase project exists** and services are enabled
5. **Verify authorized domains** include your Vercel URL

## 📋 **Quick Checklist:**

- [ ] Created new Firebase project
- [ ] Added web app to project
- [ ] Enabled Email/Password authentication
- [ ] Enabled Google authentication
- [ ] Created Firestore database
- [ ] Added authorized domain (your Vercel URL)
- [ ] Copied all 6 config values
- [ ] Added all 6 environment variables to Vercel
- [ ] Redeployed the application
- [ ] Tested login functionality

---

**This should completely fix the `CONFIGURATION_NOT_FOUND` error!** 🚀 