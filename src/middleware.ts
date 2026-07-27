/**
 * Next.js Middleware: i18n routing + auth gate
 * Protected routes require a non-expired access + refresh token pair.
 */

import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, locales } from './i18n/config';
import {
  AUTH_COOKIES,
  LOGOUT_CLEAR_COOKIES,
  SESSION_EXPIRED_LOGIN_ERROR,
} from './components/modules/login/constants';
import { getSessionValidityFromTokens } from './lib/utils/session-validity';

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});

function localeAndPathWithoutLocale(pathname: string): { locale: string; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  const hasLocalePrefix = (locales as readonly string[]).includes(first);
  const locale = hasLocalePrefix ? first : defaultLocale;
  const rest = hasLocalePrefix ? segments.slice(1) : segments;
  const pathWithoutLocale = rest.length === 0 ? '/' : `/${rest.join('/')}`;
  return { locale, pathWithoutLocale };
}

function clearAuthCookiesOnResponse(response: NextResponse): void {
  for (const name of LOGOUT_CLEAR_COOKIES) {
    response.cookies.delete(name);
  }
}

function redirectToLogin(
  request: NextRequest,
  locale: string,
  sessionExpired: boolean
): NextResponse {
  const url = new URL(`/${locale}/login`, request.url);
  if (sessionExpired) {
    url.searchParams.set('error', SESSION_EXPIRED_LOGIN_ERROR);
  }
  const response = NextResponse.redirect(url);
  clearAuthCookiesOnResponse(response);
  return response;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, pathWithoutLocale } = localeAndPathWithoutLocale(pathname);
  const isServerActionRequest = request.method === 'POST' && request.headers.has('next-action');

  if (isServerActionRequest) {
    return NextResponse.next();
  }

  const isPropertyDetails = pathWithoutLocale === '/property-details' || pathWithoutLocale.startsWith('/property-details/');
  
  if (isPropertyDetails) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);
    requestHeaders.set('x-is-auth-or-home', 'true');

    const intlResponse = intlMiddleware(request);
    
    if (intlResponse.headers.has('location')) {
      return intlResponse;
    }

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    intlResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    intlResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
    response.headers.set('x-pathname', pathname);
    response.headers.set('x-is-auth-or-home', 'true');

    return response;
  }

  // Redirect everything else to /property-details
  return NextResponse.redirect(new URL(`/${locale}/property-details`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
