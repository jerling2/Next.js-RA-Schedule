interface ServerErrorI extends Error {
    code: string;
}
type JWT = string;
type ParseCookie = (cookies: RequestCookies) => JWT;
type DecodeJWT = (jsonWebToken: JWT) => Promise<DecodedIdToken>;