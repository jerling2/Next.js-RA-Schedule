"use server";
import { NextResponse, NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const headers = request.headers;
    
    if (pathname.startsWith("/dashboard")) {

      const headerValue = headers.get("Authorization");
      if (headerValue === null || !headerValue.startsWith("Bearer ")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      const token = headerValue.slice(7);
      const res = await fetch("http://127.0.0.1:5001/next-js-ra-app/us-central1/signInWithJWT", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          token: token 
        })
      });
      const payload = await res.json();
      console.log(payload.data);
      return NextResponse.json({}, {status: 200}); //< placeholder.
    }

    return NextResponse.redirect(new URL("/", request.url));
}
 
export const config = {
  matcher: ['/protected/:path*', '/dashboard/:path*']
}