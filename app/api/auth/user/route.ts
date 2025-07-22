import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { ensureFirebaseInitialized } from '@/lib/firebase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    // Ensure Firebase is initialized
    const { db } = await ensureFirebaseInitialized();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not properly configured' },
        { status: 500 }
      );
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 