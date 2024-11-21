import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Get token for authentication

// Middleware function
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl;

    // Redirect authenticated users from sign-in/sign-up/verify to dashboard
    if (
        token && 
        (
            url.pathname.startsWith('/sign-in') || 
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users trying to access the dashboard to the home page
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    // Allow all other requests
    return NextResponse.next();
}

// Config for path matching
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/verify/:path*',
        '/dashboard/:path*',
    ],
};

