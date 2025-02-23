interface ServerError extends Error {
    code: string;
}

type ProtectedRoute = (
    userCredentials: DecodedIdToken | undefined,
    baseURL?: string | URL | '',
) => NextResponse;