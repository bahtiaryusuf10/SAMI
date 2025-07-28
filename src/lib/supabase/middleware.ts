import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) { // Movin to src/middleware.ts
  // eslint-disable-next-line prefer-const
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
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.refreshSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPaths = ['/auth', '/reset-password', '/share', '/api/public'];

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));

  }
  
  if (user) {
    const userRole = user.app_metadata.user_role;

    if (!userRole && request.nextUrl.pathname !== '/pending-approval') {
      return NextResponse.redirect(new URL('/pending-approval', request.url));
    }
  }

  return response;
}
