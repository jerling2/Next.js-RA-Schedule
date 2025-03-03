/**
 * @route POST /api/authenticate
 * @description Server-set cookie containing a JWT.
 * @param {NextRequest} request - The HTTP request object.
 * @returns {NextResponse} Try to respond with a cookie.
 */
"use server";
import { NextRequest, NextResponse } from "next/server";
import { authTokenName } from "@/server/dotenv";

export async function POST(request: NextRequest) {
    const headersList = new Headers(request.headers);
    const token = headersList.get('Authorization');
    if (token === null) {
        return NextResponse.json({error: "Missing Authorization header"}, {status: 400});
    }
    // Check for 'Bearer' by convention (RFC 6749 - The OAuth 2.0 Authorization Framework)
    if (!token.startsWith("Bearer ")) {
        return NextResponse.json({error: "Missing 'Bearer ' in the Authorization header"}, {status: 400});
    }
    const response = NextResponse.json({message: "OK"}, {status: 200});
    response.cookies.set(authTokenName, token, {
        httpOnly: true, // Cookie cannot be accessed by JavaScript in the DOM.
        sameSite: 'strict', // Cookie can be sent to any domain or subdomain.
        maxAge: 86400, // 24 hours
        secure: true, // Cookie must be sent with https.
        path: '/',
    });
    return response;
}   