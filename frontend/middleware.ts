import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

const AUTH_PAGES = ['/login'];

const isAuthPage = (pathname: string) => {
    return AUTH_PAGES.some((path) => pathname.startsWith(path))
};

const getJwtSecert = () => {
    const secret = process.env.JWT_SECRET_KEY;
    if(!secret){
        throw new Error('JWT_SECRET_KEY is not set in environment variables');
    }

    return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest){
    const {pathname} = request.nextUrl;
    const token = request.cookies.get('token')?.value;
    
    const userCookies = request.cookies.get('user')?.value;
    
    let hasVerifiedToken = false;
    let secret: Uint8Array | undefined;

    if(token){
        try {
            if(!secret) secret = getJwtSecert();
            await jwtVerify(token, secret);
            hasVerifiedToken = true;
        } catch (err){
            hasVerifiedToken = false;
        }
    }

    const isAuthPageRequested = isAuthPage(pathname);

    if(isAuthPageRequested){
        if(hasVerifiedToken){
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    if(!hasVerifiedToken){
        const redirectUrl = new URL('/login', request.url);

        redirectUrl.searchParams.set('next', pathname);
        const response = NextResponse.redirect(redirectUrl);

        if(token){
            response.cookies.delete('token');
            response.cookies.delete('user');
        }

        return response;
    }

    // Jika lolos semua pemeriksaan di atas:
    // Pengguna terotentikasi DAN berada di halaman yang dilindungi.
    // Kita izinkan akses.
    
    // Catatan: Di sinilah Anda bisa menambahkan Role-Based Access Control (RBAC)
    // jika diperlukan di masa depan, dengan membaca 'userCookie'
    // if (pathname.startsWith('/pengguna') && userCookie) {
    //   const user = JSON.parse(userCookie);
    //   if (user.role.nama !== 'Superadmin') {
    //     return NextResponse.redirect(new URL('/unauthorized', request.url));
    //   }
    // }

    return NextResponse.next();

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}