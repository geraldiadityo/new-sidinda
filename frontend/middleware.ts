import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const notProtectedRoutes = ['/login'];
    const pathName = request.nextUrl.pathname;
    const isNotProtected = notProtectedRoutes.some((path) => pathName.startsWith(path));

    if(!isNotProtected && !token){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/pengguna/:path*',
        '/role/:path*'
    ]
}