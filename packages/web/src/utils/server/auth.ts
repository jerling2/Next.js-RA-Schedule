"use server";
import * as logger from "firebase-functions/logger";
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import * as Err from "@/server/error";
import { ServerError } from "@/server/error";
import { authTokenName, decodeJWTEndpoint } from "@/server/dotenv";

const __getAuthToken = (cookies: RequestCookies): string => {
    const authToken = cookies.get(authTokenName)?.value;
    if (authToken === undefined) {
        throw new Err.InvalidAuthToken('The auth token was not found.');
    }
    if (!authToken.startsWith("Bearer ")) {
        throw new Err.InvalidAuthToken('The auth token did not start with \'Bearer \'');
    }
    const cleanAuthToken = authToken.slice(7);
    return cleanAuthToken;
}

const __cloudDecode = async (authToken: string): Promise<DecodedIdToken> => {
    const response = await fetch(decodeJWTEndpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          token: authToken 
        })
    });
    const jsonResponse = await response.json();
    const decodedIdToken: DecodedIdToken = jsonResponse.data;
    return decodedIdToken;
}

export const getUserCredentials = async (cookies: RequestCookies): Promise<DecodedIdToken | undefined> => {
    try {
        const jwt = __getAuthToken(cookies);
        const decodedIdToken = __cloudDecode(jwt);
        return decodedIdToken;
    } catch (error: unknown) {
        if (error instanceof ServerError) {
            logger.error(`ServerError: ${error.code} - ${error.message}`);
        } else {
            logger.error(`Uncaught error`, {error: error});
        }
        return undefined;
    }
}