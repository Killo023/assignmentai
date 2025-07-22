import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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
      {
        error: 'Failed to fetch assignments',
        details:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as any).message
            : String(error),
        stack: typeof error === 'object' && error !== null && 'stack' in error ? (error as any).stack : undefined,
      },
      { status: 500 }
    );
  }
} 