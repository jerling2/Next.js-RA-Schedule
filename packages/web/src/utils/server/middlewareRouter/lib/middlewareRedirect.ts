"use server";
import { NextResponse } from "next/server";


export const middlewareRedirect: MiddlewareRedirect = (pathname, baseURL) => {
    return NextResponse.redirect(new URL(pathname, baseURL));
}