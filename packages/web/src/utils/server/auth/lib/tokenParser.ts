"use server";
import { Err, AUTH_TOKEN_NAME, DECODE_JWT_ENDPOINT, isDecodedIdToken} from "@/server/auth";


export const __parseCookie: ParseCookie = (cookies) => {
    const sessionToken = cookies.get(AUTH_TOKEN_NAME);
    if (sessionToken === undefined) {
        throw new Err.InvalidAuthToken(`The token '${AUTH_TOKEN_NAME}' was not found`);
    }
    const bearer = sessionToken.value;
    if (!bearer.startsWith("Bearer ")) {
        throw new Err.InvalidAuthToken(`'${AUTH_TOKEN_NAME}' value does not start with \'Bearer \'`);
    }
    const jsonWebToken = bearer.slice(7);
    return jsonWebToken as JWT;
}

export const __decodeJWT: DecodeJWT = async (jsonWebToken) => {
    const response = await fetch(DECODE_JWT_ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          token: jsonWebToken 
        })
    });
    const jsonResponse = await response.json();
    const decodedIdToken = jsonResponse.data;
    if (!isDecodedIdToken(decodedIdToken)) {
        throw new Err.InvalidDecodedIdToken('DecodedIdToken was malformed.');
    }
    return decodedIdToken;
}