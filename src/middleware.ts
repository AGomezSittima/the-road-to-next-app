import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { appConfig } from "./utils/app-config";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const response = NextResponse.next();
    const token =
      request.cookies.get(appConfig.cookiesKeys.authSession)?.value ?? null;
    if (token !== null) {
      response.cookies.set(appConfig.cookiesKeys.authSession, token, {
        path: "/",
        maxAge: appConfig.authSessions.expirationTimeInMS / 1000,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403,
    });
  }

  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return NextResponse.next();
}
