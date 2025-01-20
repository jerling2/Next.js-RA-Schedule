import * as logger from "firebase-functions/logger";
import * as Err from "@/lib/server/error";

if (process.env.AUTH_TOKEN_NAME === undefined) {
    throw new Err.UndefinedEnvironment("Undefined environment variable 'AUTH_TOKEN_NAME'");
}

if (process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === undefined) {
    logger.warn("Undefined environment variable 'NEXT_PUBLIC_USE_AUTH_EMULATOR'");
}

if (process.env.DECODE_JWT_ENDPOINT === undefined) {
    logger.warn("Undefined environment variable 'DECODE_JWT_ENDPOINT'");
}

let decodeJWTUrl = '';
if (process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true') {
    decodeJWTUrl = 'http://127.0.0.1:5001/next-js-ra-app/us-central1/decodeJWT';
} else if (process.env.DECODE_JWT_ENDPOINT !== undefined) {
    decodeJWTUrl = process.env.DECODE_JWT_ENDPOINT;
} else {
    throw new Err.UndefinedEnvironment("Neither 'AUTH_ENABLED' nor 'DECODE_JWT_ENDPOINT' are defined.");
}

export const authTokenName = process.env.AUTH_TOKEN_NAME;
export const decodeJWTEndpoint = decodeJWTUrl;
