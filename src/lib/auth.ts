
'use server';

import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getUser } from '@/lib/data';
import type { SessionPayload } from '@/lib/types';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-super-secret-key-that-is-long-and-secure';
const COOKIE_NAME = 'session';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

// --- SESSION MANAGEMENT ---

export async function createSession(username: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const payload: SessionPayload = { username, expiresAt };

  const token = sign(payload, SECRET_KEY, {
    expiresIn: '7d',
  });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = verify(token, SECRET_KEY) as SessionPayload;
    if (new Date(payload.expiresAt) < new Date()) {
      await logout(); // Logout if expired
      return null;
    }
    return payload;
  } catch (error) {
    return null; // Invalid token
  }
}

export async function logout() {
  cookies().set(COOKIE_NAME, '', { expires: new Date(0) });
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
    const user = await getUser(username);

    if (!user || !user.password) {
      redirect('/admin/login?error=Invalid username or password.');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      redirect('/admin/login?error=Invalid username or password.');
    }

    // Credentials are valid, create session
    await createSession(username);

  } catch (error) {
    // This is the important part. If the error is a redirect error, re-throw it.
    if (error.type === 'NEXT_REDIRECT') {
      throw error;
    }
    
    // For any other type of error (DB connection, etc.)
    console.error('Login error:', error);
    redirect('/admin/login?error=An internal server error occurred.');
  }
  
  // This is only reached if the try block completes without any error.
  redirect('/admin/dashboard');
}
