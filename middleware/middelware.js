import { NextResponse } from "next/server";

export function middleware(request) {

    const session = request.cookies.get("better-auth.session");

    const { pathname } = request.nextUrl;

    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    if (session && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register"],
};
