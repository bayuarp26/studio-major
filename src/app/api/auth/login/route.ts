import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminUser, updateAdminUserLastLogin } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN API CALLED ===');
    const body = await request.json();
    const { username, password } = body;
    console.log('Username:', username);
    console.log('Password length:', password ? password.length : 'no password');

    if (!username || !password) {
      console.log('❌ Missing username or password');
      return NextResponse.json({ 
        success: false,
        error: 'Username dan password wajib diisi' 
      }, { status: 400 });
    }

    // Get admin user from database
    console.log('🔍 Looking for user in database...');
    const adminUser = await getAdminUser(username);
    console.log('User found:', adminUser ? 'Yes' : 'No');
    
    if (!adminUser || !adminUser.password) {
      console.log('❌ User not found or no password');
      return NextResponse.json({ 
        success: false,
        error: 'Username atau password salah' 
      }, { status: 401 });
    }

    console.log('User details:', {
      username: adminUser.username,
      isActive: adminUser.isActive,
      hasPassword: !!adminUser.password
    });

    // Check if user is active
    if (!adminUser.isActive) {
      console.log('❌ User is not active');
      return NextResponse.json({ 
        success: false,
        error: 'Account is deactivated. Please contact administrator.' 
      }, { status: 401 });
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const passwordsMatch = await bcrypt.compare(password, adminUser.password);
    console.log('Password match:', passwordsMatch);
    
    if (!passwordsMatch) {
      console.log('❌ Password does not match');
      return NextResponse.json({ 
        success: false,
        error: 'Username atau password salah' 
      }, { status: 401 });
    }

    // Update last login time
    console.log('✅ Login successful, updating last login time...');
    await updateAdminUserLastLogin(username);

    return NextResponse.json({ 
      success: true, 
      message: 'Login berhasil',
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Terjadi kesalahan server internal'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
