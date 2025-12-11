import { hashToken } from "@/utils/crypto";

import * as authDataAccess from "../data";
import { hashPassword } from "../lib/password";
import { getPasswordResetTokenByTokenHash } from "../queries/get-password-reset-token";

export const resetPassword = async (tokenId: string, password: string) => {
  const tokenHash = hashToken(tokenId);

  const passwordResetToken = await getPasswordResetTokenByTokenHash(tokenHash);

  if (passwordResetToken) {
    await authDataAccess.deletePasswordResetToken(tokenHash);
  }

  if (
    !passwordResetToken ||
    Date.now() > passwordResetToken.expiresAt.getTime()
  ) {
    throw new Error("Expired or invalid verification token");
  }

  await authDataAccess.clearSessions(passwordResetToken.userId);

  const passwordHash = await hashPassword(password);

  await authDataAccess.updateUser({
    id: passwordResetToken.userId,
    passwordHash,
  });

  return passwordResetToken;
};
