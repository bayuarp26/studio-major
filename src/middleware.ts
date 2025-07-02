
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

  // Jika mencoba mengakses halaman login tetapi SUDAH memiliki cookie,
  // arahkan ke dasbor. Ini mencegah pengguna yang sudah login melihat halaman login lagi.
  if (pathname.startsWith('/admin/login') || pathname === '/login') {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }
  
  // Untuk semua rute admin lainnya, periksa apakah cookie sesi ADA.
  // Kita tidak memverifikasi token di sini untuk menghindari masalah runtime Edge.
  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      // Jika tidak ada cookie, paksa redirect ke halaman login.
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Izinkan semua permintaan lainnya untuk melanjutkan.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
