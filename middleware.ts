"use server";
import { DecodedIdToken } from 'firebase-admin/auth';
import { NextResponse, NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies;
    
    if (pathname.startsWith("/dashboard")) {
      const token = cookies.get('token')?.value;
      if (token === undefined || !token.startsWith("Bearer ")) {
        return NextResponse.redirect(new URL("/welcome", request.url));
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

      if (decodedIdToken.role === "admin") {
        return NextResponse.next();
      } else {
        return NextResponse.json(
          { error: 'authentication failed' },
          { status: 401 }
        );
      }
    }
    return NextResponse.redirect(new URL("/welcome", request.url));
}
 
export const config = {
  matcher: ['/dashboard/:path*']
}