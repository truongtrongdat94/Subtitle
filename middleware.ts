import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const publicRoutes = ["/", "/api/upload", "/outputs"];

export default function middleware(req: NextRequest) {
  const isPublic = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  
  if (req.nextUrl.pathname.startsWith('/outputs/')) {
    // Get the file path from the URL
    const filePath = req.nextUrl.pathname.replace('/outputs/', '');
    // Create a new response from a new URL that points to the static file
    const url = new URL(`/api/static/${filePath}`, req.url);
    return NextResponse.rewrite(url);
  }
  
  if (!isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc|outputs)(.*)"],
};