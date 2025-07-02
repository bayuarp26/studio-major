
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

  // Handle admin authentication and redirection first
  if (pathname.startsWith('/admin') || pathname === '/login') {
    const sessionCookie = request.cookies.get('session')?.value;
    if (pathname.startsWith('/admin/login') || pathname === '/login') {
      if (sessionCookie) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      // Explicitly redirect /login to /admin/login
      if (pathname === '/login') {
         return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    }
    if (pathname.startsWith('/admin')) {
      if (!sessionCookie) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
    return NextResponse.next();
  }

  // Handle i18n for all other routes
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // If the root path is requested, redirect to the localized root
    if (pathname === '/') {
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
