import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

export const createPasswordResetToken = async (
  userId: string,
  tokenHash: string,
) => {
  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(
        Date.now() + appConfig.passwordReset.expirationTimeInMs,
      ),
    },
  });
};
