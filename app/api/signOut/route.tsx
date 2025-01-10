/**
 * @route POST /api/signOut
 */
"use server";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    const authToken = request.cookies.get('token')?.value;
    if (authToken === undefined) {
        return NextResponse.json({message: "User is already signed out"}, {status: 200});
    }
    // Check for 'Bearer' by convention (RFC 6749 - The OAuth 2.0 Authorization Framework)
    if (!authToken.startsWith("Bearer ")) {
        return NextResponse.json({message: "Missing 'Bearer ' in the Authorization header"}, {status: 400});
    }
    const response = NextResponse.json({message: "OK"}, {status: 200});
    response.cookies.set('token', '', {
        maxAge: 0
    });
    return response;
}   