import { NextRequest, NextResponse } from 'next/server';
import { checkSessionStatus } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionStatus = await checkSessionStatus();
    
    if (!sessionStatus.valid) {
      return NextResponse.json(
        { 
          error: 'No active session',
          reason: sessionStatus.reason,
          sessionId: sessionStatus.sessionId
        }, 
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    return NextResponse.json(
      { 
        message: 'Session is valid',
        sessionId: sessionStatus.sessionId,
        timestamp: new Date().toISOString()
      }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=10', // Cache for 10 seconds
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Session check failed' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }
}
