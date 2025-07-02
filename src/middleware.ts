
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '../i18n.config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // The 'locales' array from i18n.config is readonly. Create a mutable copy.
  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  try {
    const locale = matchLocale(languages, locales, i18n.defaultLocale);
    return locale;
  } catch (e) {
    // Fallback to default locale if matching fails for any reason
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Step 1: Handle authentication routes completely separately.
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      const sessionCookie = request.cookies.get('session')?.value;
      
      // If trying to access login page with a valid session, redirect to the dashboard.
      if ((pathname === '/admin/login' || pathname === '/login') && sessionCookie) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      
      // If trying to access any admin page (except login) without a session, force redirect to login.
      if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !sessionCookie) {
          return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // Explicitly redirect the old /login path to /admin/login for consistency.
      if (pathname === '/login') {
         return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // If none of the above conditions are met, allow the request to proceed (e.g., accessing login page without session).
      return NextResponse.next();
  }

  // Step 2: For all other routes, check if a locale is present.
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Step 3: If no locale is present, it's a public page that needs redirection.
  const locale = getLocale(request);
  
  // Construct the new URL carefully to handle the root path correctly.
  const newPathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  
  request.nextUrl.pathname = newPathname;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and static files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
