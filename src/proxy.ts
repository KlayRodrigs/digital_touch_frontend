import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route protection is handled client-side by AuthContext + (app)/layout.tsx.
// The refresh_token cookie has Path=/auth (set by the backend), so it is never
// present on non-auth requests — a server-side cookie guard cannot work here.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
