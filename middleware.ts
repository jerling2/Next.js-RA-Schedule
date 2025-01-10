"use server";
import { DecodedIdToken } from 'firebase-admin/auth';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse, NextRequest } from 'next/server'

const authorizeUser = async (cookies: RequestCookies): Promise<DecodedIdToken | undefined> => {
  const token = cookies.get('token')?.value;
    if (token === undefined || !token.startsWith("Bearer ")) {
      return undefined;
    }
    const jwt = token.slice(7);
    const res = await fetch("http://127.0.0.1:5001/next-js-ra-app/us-central1/decodeJWT", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        token: jwt 
      })
    });
    const jsonResponse = await res.json();
    const decodedIdToken: DecodedIdToken = jsonResponse.data;
    return decodedIdToken;
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies;
    
    if (pathname.startsWith("/admin")) {
      const decodedIdToken = await authorizeUser(cookies);
      if (decodedIdToken === undefined) { 
        return NextResponse.redirect(new URL("/welcome", request.url));
      }
      if (decodedIdToken.role === "admin") {
        return NextResponse.next();
      } else if (decodedIdToken.role === "user") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.json(
          { 
            error: 'authentication failed',
            message: 'Contact your system admin if you believe there was a mistake.'
          },
          { status: 401 }
        );
      }
    }

    if (pathname.startsWith("/dashboard")) {
      const decodedIdToken = await authorizeUser(cookies);
      if (decodedIdToken === undefined) { 
        return NextResponse.redirect(new URL("/welcome", request.url));
      }
      if (decodedIdToken.role === "user") {
        return NextResponse.next();
      } else if (decodedIdToken.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.json(
          { 
            error: 'authentication failed',
            message: 'Contact your system admin if you believe there was a mistake.'
          },
          { status: 401 }
        );
      }
    }
    return NextResponse.redirect(new URL("/welcome", request.url));
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path']
}