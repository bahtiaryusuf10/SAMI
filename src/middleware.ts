import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions, createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPaths = ['/auth', '/reset-password', '/share', '/api/public'];
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (user) {
    const userRole = user.app_metadata.user_role;

    if (!userRole && pathname !== '/pending-approval') {
      return NextResponse.redirect(new URL('/pending-approval', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
