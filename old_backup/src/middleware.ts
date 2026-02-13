import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the request is for an admin page (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const session = request.cookies.get("admin_session");

        if (!session || session.value !== "true") {
            // Redirect to login page if no session
            const url = request.nextUrl.clone();
            url.pathname = "/admin/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
