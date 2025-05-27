import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // /spaces/register 경로를 /host/spaces/register로 리다이렉션
  if (request.nextUrl.pathname === "/spaces/register") {
    return NextResponse.redirect(new URL("/host/spaces/register", request.url));
  }

  return NextResponse.next();
}
