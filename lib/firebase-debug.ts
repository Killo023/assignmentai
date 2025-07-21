// Firebase Configuration Debugger
export function debugFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log('🔍 Firebase Configuration Debug:');
  console.log('====================================');
  
  Object.entries(config).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    const displayValue = value ? 
      (value.length > 20 ? `${value.substring(0, 20)}...` : value) : 
      'NOT SET';
    console.log(`${status} ${key}: ${displayValue}`);
  });

  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

  if (missingVars.length > 0) {
    console.log('\n❌ Missing environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Add these to your Vercel environment variables or .env.local file');
    return false;
  } else {
    console.log('\n✅ All Firebase environment variables are present');
    return true;
  }
}

export function getFirebaseConfigSummary() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const hasAll = Object.values(config).every(value => !!value);
  const missing = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return {
    hasAll,
    missing,
    config: hasAll ? config : null
  };
} 