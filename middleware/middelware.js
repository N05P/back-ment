import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request) {
    const token = request.cookies.get("token");

    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register"],
};
