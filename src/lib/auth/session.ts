import { appConfig } from "@/utils/app-config";
import { hashToken } from "@/utils/crypto";
import type { Session, User } from "@prisma/client";

import { prisma } from "../prisma";

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

function calculateSessionExpiryDateFromNow(): Date {
  return new Date(Date.now() + appConfig.authSessions.expirationTimeInMS);
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

  await prisma.session.create({
    data: session,
  });

  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = hashToken(token);

  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });

    return { session: null, user: null };
  }

  const refreshDate =
    session.expiresAt.getTime() -
    appConfig.authSessions.expirationTimeInMS *
      appConfig.authSessions.refreshIntervalRatio;
  if (Date.now() >= refreshDate) {
    session.expiresAt = calculateSessionExpiryDateFromNow();

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId: userId,
    },
  });
}
