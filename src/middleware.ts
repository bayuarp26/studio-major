
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '../i18n.config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { verify } from 'jsonwebtoken';
import type { SessionPayload } from '@/lib/types';

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

async function isValidAdminSession(sessionToken: string): Promise<boolean> {
  try {
    const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-super-secret-key-that-is-long-and-secure';
    const payload = verify(sessionToken, SECRET_KEY) as SessionPayload;
    
    // Check if token is expired
    if (new Date(payload.expiresAt) < new Date()) {
      return false;
    }

    // Note: In middleware, we can't easily access the database to check activeSessionId
    // The full session validation will be done in getSession() function
    // This is just a basic JWT validation
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Step 1: Handle authentication routes completely separately.
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      const sessionCookie = request.cookies.get('session')?.value;
      
      // If trying to access login page with a valid session, redirect to the dashboard.
      if ((pathname === '/admin/login' || pathname === '/login') && sessionCookie) {
          const isValid = await isValidAdminSession(sessionCookie);
          if (isValid) {
              return NextResponse.redirect(new URL('/admin/dashboard', request.url));
          }
      }
      
      // If trying to access any admin page (except login) without a session, force redirect to login.
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
          if (!sessionCookie) {
              return NextResponse.redirect(new URL('/admin/login', request.url));
          }
          
          // Check if session is valid
          const isValid = await isValidAdminSession(sessionCookie);
          if (!isValid) {
              // Clear the invalid session cookie and redirect to login
              const response = NextResponse.redirect(new URL('/admin/login', request.url));
              response.cookies.set('session', '', { expires: new Date(0) });
              return response;
          }
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
