import { NextRequest, NextResponse } from 'next/server';
import { processAssignment } from '@/lib/gemini';
import { doc, addDoc, collection, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ensureFirebaseInitialized } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { content, fileName, userId, context } = await request.json();

    if (!content || !fileName || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: content, fileName, userId' },
        { status: 400 }
      );
    }

    // Ensure Firebase is initialized
    const { db } = await ensureFirebaseInitialized();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not properly configured' },
        { status: 500 }
      );
    }

    // Check user subscription and usage limits
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    const { subscription, usage } = userData;

    // Check if trial expired
    if (subscription.plan === 'trial') {
      const trialEndDate = subscription.trialEndDate.toDate();
      if (new Date() > trialEndDate) {
        return NextResponse.json(
          { error: 'Trial expired. Please upgrade to continue.' },
          { status: 403 }
        );
      }

      // Check usage limits for trial users
      if (usage.assignmentsCompleted >= usage.assignmentsLimit) {
        return NextResponse.json(
          { error: 'Assignment limit reached. Please upgrade to continue.' },
          { status: 403 }
        );
      }
    }

    // Process assignment with Gemini AI
    const aiResult = await processAssignment(content, context);

    // Save assignment to Firestore
    const assignmentData = {
      userId,
      fileName,
      originalContent: content,
      processedContent: aiResult,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      chatHistory: [],
    };

    const assignmentRef = await addDoc(collection(db, 'assignments'), assignmentData);

    // Update user usage count
    await updateDoc(userRef, {
      'usage.assignmentsCompleted': increment(1),
    });

    return NextResponse.json({
      assignmentId: assignmentRef.id,
      content: aiResult,
      status: 'completed',
    });
  } catch (error) {
    console.error('Error processing assignment:', error);
    return NextResponse.json(
      { error: 'Failed to process assignment' },
      { status: 500 }
    );
  }
} 