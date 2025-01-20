/**
 * @route POST /api/signOut
 */
"use server";
import { NextRequest, NextResponse } from "next/server";
import { authTokenName } from "@/lib/server/dotenv";
export async function POST(request: NextRequest) {
    const authToken = request.cookies.get(authTokenName)?.value;
    if (authToken === undefined) {
        return NextResponse.json({message: "User is already signed out"}, {status: 200});
    }
    // Check for 'Bearer' by convention (RFC 6749 - The OAuth 2.0 Authorization Framework)
    if (!authToken.startsWith("Bearer ")) {
        return NextResponse.json({message: "Missing 'Bearer ' in the Authorization header"}, {status: 400});
    }
    const response = NextResponse.json({message: "OK"}, {status: 200});
    response.cookies.set(authTokenName, '', {
        maxAge: 0
    });
    return response;
}   