type MiddlewareRedirect = (pathname: string, baseURL: URL) => NextResponse;

type RouteAuthenticator = (pathname: string, cookies: RequestCookies) => NextResponse;

type UseMiddlewareRouter = (request: NextRequest) => RouteAuthenticator;

type ProtectedRoute = (
    token: DecodedIdToken,
    baseURL: URL,
) => NextResponse;