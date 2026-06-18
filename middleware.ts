import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PAT_AUTH_COOKIE = "pat_auth";

export function middleware(request: NextRequest) {
  const isPatBlogRoute = request.nextUrl.pathname.startsWith("/pat/blogs");

  if (!isPatBlogRoute) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(PAT_AUTH_COOKIE)?.value === "1";

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/pat";
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/pat/blogs/:path*"],
};