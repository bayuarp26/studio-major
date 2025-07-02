
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '../i18n.config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and images
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  const isAuthRoute = pathname.startsWith('/admin') || pathname.startsWith('/login');


  if (isAuthRoute) {
    const sessionCookie = request.cookies.get('session')?.value;
    // If trying to access login page with a session, redirect to dashboard
    if ((pathname === '/admin/login' || pathname === '/login') && sessionCookie) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // If trying to access admin pages without a session, redirect to login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !sessionCookie) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Explicitly redirect /login to /admin/login
    if (pathname === '/login') {
       return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Redirect if there is no locale and it's not an auth route
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    
    // Prepend the locale to the path
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
