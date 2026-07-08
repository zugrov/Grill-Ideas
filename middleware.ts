import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const nextAction = request.headers.get("next-action");
  if (nextAction) {
    return new NextResponse(null, { status: 404 });
  }

  const path = request.nextUrl.pathname;
  const needsSession =
    path.startsWith("/dashboard") ||
    path.startsWith("/login") ||
    path.startsWith("/register");

  if (needsSession) {
    return updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
      has: [{ type: "header", key: "next-action" }],
    },
  ],
};
