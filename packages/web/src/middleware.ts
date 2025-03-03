"use server";
import type { NextRequest } from 'next/server';
import { useMiddlewareRouter } from '@/server/middlewareRouter';


export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies;
    const routeUser = useMiddlewareRouter(request);
    return routeUser(pathname, cookies);
}

 
export const config = {
  matcher: ['/user/:path*', '/admin/:path*']
}