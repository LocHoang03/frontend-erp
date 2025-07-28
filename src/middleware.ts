import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session');

  if (!session?.value) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/dashboard/:path*',
    '/manage-accounts/:path*',
    '/permissions/:path*',
    '/roles/:path*',
    '/employees/:path*',
    '/departments/:path*',
    '/positions/:path*',
    '/warehouses/:path*',
    '/warehouses-transfers/:path*',
    '/products/:path*',
    '/category-products/:path*',
    '/attendances/:path*',
    '/salary/:path*',
    '/projects/:path*',
    '/tasks/:path*',
    '/partners/:path*',
    '/warehouse-transactions/:path*',
    '/orders/:path*',
    '/users/:path*',
  ],
};
