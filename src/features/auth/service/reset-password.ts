import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/crypto";

import { hashPassword } from "../lib/password";

// TODO: Extract prisma calls to DAL
export const resetPassword = async (tokenId: string, password: string) => {
  const tokenHash = hashToken(tokenId);

  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (passwordResetToken) {
    await prisma.passwordResetToken.delete({
      where: { tokenHash },
    });
  }

  if (
    !passwordResetToken ||
    Date.now() > passwordResetToken.expiresAt.getTime()
  ) {
    throw new Error("Expired or invalid verification token");
  }

  await prisma.session.deleteMany({
    where: { userId: passwordResetToken.userId },
  });

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: passwordResetToken.userId },
    data: { passwordHash },
  });

  return passwordResetToken;
};
