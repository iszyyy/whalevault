import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

let missingSecretLogged = false;

export async function proxy(req: NextRequest) {
  const authSecret = process.env.NEXTAUTH_SECRET;
  if (!authSecret) {
    if (!missingSecretLogged) {
      console.warn("[Auth] NEXTAUTH_SECRET is missing. Dashboard auth guard is disabled.");
      missingSecretLogged = true;
    }
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: authSecret });
  const { pathname } = req.nextUrl;

  // Protect all /dashboard/* routes
  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
