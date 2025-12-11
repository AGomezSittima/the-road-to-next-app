import { appConfig } from "@/utils/app-config";
import { hashToken } from "@/utils/crypto";
import type { Session, User } from "@prisma/client";

import * as authDataAccess from "../data";
import { getSession } from "../queries/get-session";

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

function calculateSessionExpiryDateFromNow(): Date {
  return new Date(Date.now() + appConfig.authSessions.expirationTimeInMs);
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = hashToken(token);
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: calculateSessionExpiryDateFromNow(),
  };

  await authDataAccess.createSession(session);

  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = hashToken(token);

  const result = await getSession(sessionId);

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    await authDataAccess.deleteSession(sessionId);

    return { session: null, user: null };
  }

  const refreshDate =
    session.expiresAt.getTime() -
    appConfig.authSessions.expirationTimeInMs *
      appConfig.authSessions.refreshIntervalRatio;
  if (Date.now() >= refreshDate) {
    session.expiresAt = calculateSessionExpiryDateFromNow();

    authDataAccess.updateSession(session.id, session.expiresAt);
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await authDataAccess.deleteSession(sessionId);
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await authDataAccess.deleteSessions(userId);
}
