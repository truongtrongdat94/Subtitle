import { NextResponse } from "next/server";

const publicRoutes = ["/", "/api/upload"];

import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const isPublic = publicRoutes.includes(req.nextUrl.pathname);
  if (!isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};