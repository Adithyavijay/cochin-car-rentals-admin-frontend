import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) { 

    
    if (request.nextUrl.pathname.startsWith("/")) {
        // check if the admin request contains token in the cookie
     
        const adminToken = request.cookies.get("adminToken")?.value;


        // Continue with the request if no redirection is needed
        return NextResponse.next();
    }
}
// Specify which routes this middleware should run on
export const config = {
  matcher: '/:path*',
} 