
'use server';

import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getAdminUser, updateAdminUserActiveSession, clearAdminUserActiveSession } from '@/lib/data';
import type { SessionPayload } from '@/lib/types';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-super-secret-key-that-is-long-and-secure';
const COOKIE_NAME = 'session';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

// --- SESSION MANAGEMENT ---

export async function createSession(username: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const sessionId = randomUUID(); // Generate unique session ID
  const payload: SessionPayload = { username, sessionId, expiresAt };

  console.log('Creating new session for user:', username, 'with sessionId:', sessionId);

  const token = sign(payload, SECRET_KEY, {
    expiresIn: '7d',
  });

  // Update user's active session in database (this will invalidate previous sessions)
  await updateAdminUserActiveSession(username, sessionId);
  console.log('Updated active session in database for user:', username);

  // Record login event for real-time detection
  try {
    await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/admin/login-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, sessionId })
    });
    console.log('Login event recorded for real-time detection');
  } catch (error) {
    console.error('Failed to record login event:', error);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  console.log('Session created and cookie set for user:', username);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    console.log('No session token found in cookies');
    return null;
  }

  try {
    const payload = verify(token, SECRET_KEY) as SessionPayload;
    if (new Date(payload.expiresAt) < new Date()) {
      // Don't call logout here, just return null
      console.log('Session expired for user:', payload.username);
      return null;
    }

    // Check if this session is still active in database
    const adminUser = await getAdminUser(payload.username);
    if (!adminUser) {
      // User not found or inactive
      console.log('User not found or inactive:', payload.username);
      return null;
    }

    if (!adminUser.activeSessionId) {
      console.log('No active session ID in database for user:', payload.username);
      return null;
    }

    if (adminUser.activeSessionId !== payload.sessionId) {
      // Session is no longer active (another session has taken over or no active session)
      console.log('Session ID mismatch for user:', payload.username, 'expected:', payload.sessionId, 'actual:', adminUser.activeSessionId);
      return null;
    }

    console.log('Session valid for user:', payload.username, 'sessionId:', payload.sessionId);
    return payload;
  } catch (error) {
    console.error('Session validation error:', error);
    return null; // Invalid token
  }
}

// Function to check session status without any side effects
export async function checkSessionStatus(): Promise<{valid: boolean, reason?: string, sessionId?: string}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return { valid: false, reason: 'No token found' };
  }

  try {
    const payload = verify(token, SECRET_KEY) as SessionPayload;
    if (new Date(payload.expiresAt) < new Date()) {
      return { valid: false, reason: 'Token expired' };
    }

    const adminUser = await getAdminUser(payload.username);
    if (!adminUser) {
      return { valid: false, reason: 'User not found' };
    }

    if (!adminUser.activeSessionId) {
      return { valid: false, reason: 'No active session in database' };
    }

    if (adminUser.activeSessionId !== payload.sessionId) {
      return { 
        valid: false, 
        reason: 'Session ID mismatch', 
        sessionId: payload.sessionId 
      };
    }

    return { valid: true, sessionId: payload.sessionId };
  } catch (error) {
    return { valid: false, reason: 'Invalid token' };
  }
}

export async function logout() {
  try {
    // Get current session to clear it from database
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    
    if (token) {
      try {
        const payload = verify(token, SECRET_KEY) as SessionPayload;
        await clearAdminUserActiveSession(payload.username);
      } catch (error) {
        // Token invalid, but still clear cookie
        console.error('Error clearing session from database:', error);
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Always clear the cookie regardless of database operation
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { expires: new Date(0) });
}

// Server action for logout that can be called from client components
export async function logoutAction() {
  'use server';
  await logout();
  redirect('/admin/login');
}

// --- SERVER ACTIONS ---

export async function login(formData: FormData) {
  try {
    const values = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      redirect('/admin/login?error=Invalid username or password.');
    }

    const { username, password } = parsed.data;
    
    // Get admin user from database
    const adminUser = await getAdminUser(username);
    
    if (!adminUser || !adminUser.password) {
      redirect('/admin/login?error=Invalid username or password.');
    }

    // Check if user is active
    if (!adminUser.isActive) {
      redirect('/admin/login?error=Account is deactivated. Please contact administrator.');
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, adminUser.password);
    if (!passwordsMatch) {
      redirect('/admin/login?error=Invalid username or password.');
    }

    // Credentials are valid, create session (this will automatically invalidate any existing session)
    await createSession(username);

  } catch (error) {
    // This is the important part. If the error is a redirect error, re-throw it.
    if (error && typeof error === 'object' && 'type' in error && error.type === 'NEXT_REDIRECT') {
      throw error;
    }
    
    // For any other type of error (DB connection, etc.)
    console.error('Login error:', error);
    redirect('/admin/login?error=An internal server error occurred.');
  }
  
  // This is only reached if the try block completes without any error.
  redirect('/admin/dashboard');
}
