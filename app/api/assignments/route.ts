import { NextRequest, NextResponse } from 'next/server';
import { ensureFirebaseInitialized } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Ensure Firebase is initialized
    const { db } = await ensureFirebaseInitialized();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not properly configured' },
        { status: 500 }
      );
    }

    // Get user's assignments
    const assignmentsRef = collection(db, 'assignments');
    const q = query(
      assignmentsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const assignments = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      };
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments', details: error?.message || error },
      { status: 500 }
    );
  }
} 