"use server";
import { NextResponse, NextRequest } from 'next/server'
import { getUserCredentials } from "@/server/auth";
import { adminDashboard, userDashboard } from '@/server/protected_routes';

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies;
    
    if (pathname.startsWith("/admin")) {
      const decodedIdToken = await getUserCredentials(cookies);
      return adminDashboard(decodedIdToken, request.url);

    }

    if (pathname.startsWith("/dashboard")) {
      const decodedIdToken = await getUserCredentials(cookies);
      return userDashboard(decodedIdToken, request.url);
    }
    return NextResponse.redirect(new URL("/welcome", request.url));
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path']
}