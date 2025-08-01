import { NextResponse } from 'next/server';

export function middleware(request) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Check if coming from login page or has auth header
    const isFromLogin = request.headers.get('referer')?.includes('/admin/login');
    
    if (!isFromLogin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
