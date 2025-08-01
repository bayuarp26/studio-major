import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || '085156453246';
    
    const adminUser = await getAdminUser(username);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        username: adminUser.username,
        activeSessionId: adminUser.activeSessionId,
        lastLoginAt: adminUser.lastLoginAt,
        updatedAt: adminUser.updatedAt,
        isActive: adminUser.isActive
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Debug admin user error:', error);
    return NextResponse.json(
      { error: 'Failed to get admin user data' }, 
      { status: 500 }
    );
  }
}
