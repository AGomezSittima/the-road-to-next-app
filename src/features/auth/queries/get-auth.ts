"use server";

import { cookies } from "next/headers";
import { cache } from "react";

import {
  type SessionValidationResult,
  validateSessionToken,
} from "@/lib/auth/session";
import { appConfig } from "@/utils/app-config";

export const getAuth = cache(async (): Promise<SessionValidationResult> => {
  const cookieStore = await cookies();

  const sessionId =
    cookieStore.get(appConfig.cookiesKeys.authSession)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  return await validateSessionToken(sessionId);
});
