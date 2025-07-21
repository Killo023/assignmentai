import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/huggingface';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { message, assignmentId, userId, conversationHistory } = await request.json();

    if (!message || !assignmentId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, assignmentId, userId' },
        { status: 400 }
      );
    }

    // Verify user access to assignment
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    const { subscription } = userData;

    // Check subscription for chat access
    if (subscription.plan === 'trial') {
      const trialEndDate = subscription.trialEndDate.toDate();
      if (new Date() > trialEndDate) {
        return NextResponse.json(
          { error: 'Trial expired. Chat feature requires premium subscription.' },
          { status: 403 }
        );
      }
    }

    // Get AI response
    const aiResponse = await chatWithAI(message, conversationHistory);

    // Update assignment with chat history
    const assignmentRef = doc(db, 'assignments', assignmentId);
    await updateDoc(assignmentRef, {
      chatHistory: arrayUnion({
        type: 'user',
        message,
        timestamp: new Date(),
      }, {
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
      }),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 