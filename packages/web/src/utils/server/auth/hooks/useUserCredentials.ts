"use server";
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { DecodedIdToken } from "firebase-admin/auth";
import * as logger from "firebase-functions/logger";
import { Err, __parseCookie, __decodeJWT } from "@/server/auth";


/* The type definition 'UseUserCredentials' is declared here as opposed to in the .d.ts file 
    because it uses DecodedIdToken and RequestCookies which must be imported from their
    respective libraries */
type UseUserCredentials = (cookies: RequestCookies) => Promise<DecodedIdToken | undefined>;


export const useUserCredentials: UseUserCredentials = async (cookies) => {
    try {
        const jsonWebToken = __parseCookie(cookies);
        const decodedIdToken = __decodeJWT(jsonWebToken);
        return decodedIdToken;
    } catch (error: unknown) {
        if (error instanceof Err.ServerError) {
            logger.error(`ServerError : ${error.code} : ${error.message}`);
        } else {
            logger.error(`Uncaught error`, {error: error});
        }
        return undefined;
    }
}