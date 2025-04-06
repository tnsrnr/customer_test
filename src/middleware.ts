import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 임시로 인증 체크를 비활성화
  // const token = request.cookies.get('token');
  // const isAuthPage = request.nextUrl.pathname === '/login';

  // if (!token && !isAuthPage) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // if (token && isAuthPage) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 