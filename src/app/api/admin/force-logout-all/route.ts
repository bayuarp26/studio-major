import { NextRequest, NextResponse } from 'next/server';
import { clearAllAdminActiveSessions } from '@/lib/data';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify that the requester is an authenticated admin
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Clear all active sessions from database
    await clearAllAdminActiveSessions();

    return NextResponse.json(
      { 
        message: 'All admin sessions have been terminated',
        terminatedBy: session.username
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Force logout error:', error);
    return NextResponse.json(
      { error: 'Failed to terminate sessions' }, 
      { status: 500 }
    );
  }
}
