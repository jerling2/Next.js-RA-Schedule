import type { DecodedIdToken } from "firebase-admin/auth";
import { NextResponse } from 'next/server'

export type ProtectedRoute = (
    userCredentials: DecodedIdToken | undefined,
    baseURL?: string | URL | '',
) => NextResponse;

export const adminDashboard: ProtectedRoute = (userCredentials, baseURL) => {
    if (userCredentials === undefined) {
        return NextResponse.redirect(new URL("/welcome", baseURL));
    }
    if (userCredentials.role === "admin") {
        return NextResponse.next();
    } 
    if (userCredentials.role === "user") {
        return NextResponse.redirect(new URL("/dashboard", baseURL));
    }
    return NextResponse.json(
        { 
            error: 'authentication failed',
            message: 'Contact your system admin if you believe there was a mistake.'
        },
        { status: 401 }
    );
};

export const userDashboard: ProtectedRoute = (userCredentials, baseURL) => {
    if (userCredentials === undefined) { 
        return NextResponse.redirect(new URL("/welcome", baseURL));
    }
    if (userCredentials.role === "user") {
        return NextResponse.next();
    } 
    if (userCredentials.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", baseURL));
    }
    return NextResponse.json(
        { 
            error: 'authentication failed',
            message: 'Contact your system admin if you believe there was a mistake.'
        },
        { status: 401 }
    );
}
