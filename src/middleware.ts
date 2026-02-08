import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions, createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Default response, diteruskan ke Next.js jika tidak ada redirect
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read cookie dari request (dapet sb-access-token & sb-refresh-token)
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        // Write cookie ke request & response (salah satu kejadiannya terjadi ketika refresh token)
        set(name: string, value: string, options: CookieOptions) {
          // Update cookie di request object (internal)
          request.cookies.set({ name, value, ...options })
          
          // Update response (dikirim kembali ke browser)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
         // Delete cookie (salah satu kejadiannya terjadi ketika logout)
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

  // Get user from supabase
  // Read sb-access-token dari cookie dan verifikasi JWT (by supabase)
  const {
    data: { user },
  } = await supabase.auth.getUser(); 

  const publicPaths = ['/auth', '/reset-password', '/share', '/api/public'];
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Role checking
  if (user) {
    const userRole = user.app_metadata.user_role; // Get role dari payload JWT

    // Didnt have any role dan bukan di page pending-approval → redirect to pending-approval
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
