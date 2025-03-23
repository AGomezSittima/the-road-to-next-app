import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { generateRandomToken, hashToken } from "@/utils/crypto";
import { passwordResetPath } from "@/utils/paths";
import { getBaseUrl } from "@/utils/url";

export const generatePasswordResetLink = async (userId: string) => {
  await prisma.passwordResetToken.deleteMany({ where: { userId } });

  const tokenId = generateRandomToken();
  const tokenHash = hashToken(tokenId);

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(
        Date.now() + appConfig.passwordReset.expirationTimeInMs,
      ),
    },
  });

  const pageUrl = getBaseUrl() + passwordResetPath();
  const passwordResetLink = pageUrl + `/${tokenId}`;

  return passwordResetLink;
};
