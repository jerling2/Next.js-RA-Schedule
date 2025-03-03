"use server";
import { useUserCredentials } from "@/server/auth";
import { middlewareRedirect, LANDING_PAGE, ROLE_TO_PAGE, isRole, isURL, URL_ERROR } from "@/server/middlewareRouter";
import { NextResponse } from "next/server";


export const useMiddlewareRouter: UseMiddlewareRouter = (request) => {
    const baseURL = request.baseURL;
  
    if (!isURL(baseURL)) {
        return URL_ERROR;
    }

    const auth: RouteAuthenticator = async (pathname, cookies) => {
        const decodedIdToken = await useUserCredentials(cookies);
        if (decodedIdToken === undefined) {
            return middlewareRedirect(LANDING_PAGE, baseURL);
        }
        const role = decodedIdToken.role;
        if (!isRole(role)) {
            return middlewareRedirect(LANDING_PAGE, baseURL);
        }
        const page = ROLE_TO_PAGE[role];
        if (pathname.startsWith(page)) {
            NextResponse.next();
        } else {
            return middlewareRedirect(page, baseURL);
        }
    }

    return auth;
};