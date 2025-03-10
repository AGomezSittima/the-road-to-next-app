import { cookies } from "next/headers";

import { appConfig } from "@/utils/app-config";

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();

  const cookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  };

  cookieStore.set(appConfig.cookiesKeys.authSession, token, cookie);
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();

  const cookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  };

  cookieStore.set(appConfig.cookiesKeys.authSession, "", cookie);
}
