import { NextResponse } from "next/server";

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
};

export const LANDING_PAGE = '/';

export const ROLE_TO_PAGE: {
    [k in Role]: string
} = {
    [Role.ADMIN]: '/admin',
    [Role.USER]: '/user'
}

export const URL_ERROR: RouteAuthenticator = (_, __) => (
    NextResponse.json(
        {message: 'baseURL is invalid'},
        {status: 500}
    )
)