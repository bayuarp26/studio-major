
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken';
import type { SessionPayload } from '@/lib/types';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-super-secret-key-that-is-long-and-secure';
const COOKIE_NAME = 'session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

  // Jika mencoba mengakses halaman login tetapi sudah memiliki sesi valid,
  // arahkan ke dasbor.
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/login')) {
    if (sessionCookie) {
      try {
        const payload = await verify(sessionCookie, SECRET_KEY) as SessionPayload;
        if (new Date(payload.expiresAt) > new Date()) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
      } catch (error) {
        // Token tidak valid, biarkan pengguna di halaman login.
      }
    }
    return NextResponse.next();
  }
  
  // Untuk semua rute admin lainnya, verifikasi sesi.
  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      const payload = await verify(sessionCookie, SECRET_KEY) as SessionPayload;
       // Periksa apakah token sudah kedaluwarsa
      if (new Date(payload.expiresAt) < new Date()) {
        const response = NextResponse.redirect(new URL('/admin/login', req.url));
        response.cookies.set(COOKIE_NAME, '', { expires: new Date(0) }); // Hapus cookie kedaluwarsa
        return response;
      }

      // Jika pengguna mencoba mengakses /admin, arahkan ke /admin/dashboard
      if (pathname === '/admin' || pathname === '/admin/') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      
    } catch (err) {
      // Token tidak valid, arahkan ke login dan hapus cookie yang salah
      const response = NextResponse.redirect(new URL('/admin/login', req.url));
      response.cookies.set(COOKIE_NAME, '', { expires: new Date(0) });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
