import { User } from "@prisma/client";

import * as authDataAccess from "../data";
import { getEmailVerificationTokenByUserId } from "../queries/get-email-verification-token";

// TODO: User DTO
export const verifyEmail = async (code: string, user: User) => {
  const validCode = await validateEmailVerificationCode(
    user.id,
    user.email,
    code,
  );

  if (!validCode) {
    throw new Error("Invalid or expired code");
  }

  await authDataAccess.clearSessions(user.id);
  await authDataAccess.updateUser({ id: user.id, emailVerified: true });
};

const validateEmailVerificationCode = async (
  userId: string,
  email: string,
  code: string,
) => {
  const emailVerificationToken =
    await getEmailVerificationTokenByUserId(userId);

  if (!emailVerificationToken || emailVerificationToken.code !== code) {
    return false;
  }

  await authDataAccess.deleteEmailVerificationToken(emailVerificationToken.id);

  const isExpired = Date.now() > emailVerificationToken.expiresAt.getTime();
  if (isExpired) {
    return false;
  }

  if (emailVerificationToken.email !== email) {
    return false;
  }

  return true;
};
