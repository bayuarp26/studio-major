import { NextRequest, NextResponse } from 'next/server';

// Store login events in memory for quick access
const loginEvents: { [username: string]: { sessionId: string; timestamp: number }[] } = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const since = parseInt(searchParams.get('since') || '0');
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Get recent login events for this user
    const userEvents = loginEvents[username] || [];
    const recentEvents = userEvents.filter(event => event.timestamp > since);

    return NextResponse.json({
      events: recentEvents,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Login events error:', error);
    return NextResponse.json({ error: 'Failed to get login events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, sessionId } = await request.json();
    
    if (!username || !sessionId) {
      return NextResponse.json({ error: 'Username and sessionId required' }, { status: 400 });
    }

    // Add login event
    if (!loginEvents[username]) {
      loginEvents[username] = [];
    }
    
    loginEvents[username].push({
      sessionId,
      timestamp: Date.now()
    });

    // Keep only last 10 events per user
    if (loginEvents[username].length > 10) {
      loginEvents[username] = loginEvents[username].slice(-10);
    }

    console.log('Login event recorded for real-time detection');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Record login event error:', error);
    return NextResponse.json({ error: 'Failed to record login event' }, { status: 500 });
  }
}
