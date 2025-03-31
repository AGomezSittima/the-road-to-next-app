import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { generateRandomcode } from "@/utils/crypto";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string,
) => {
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });

  const code = generateRandomcode();

  await prisma.emailVerificationToken.create({
    data: {
      code,
      userId,
      email,
      expiresAt: new Date(
        Date.now() + appConfig.emailVerification.expirationTimeInMs,
      ),
    },
  });

  return code;
};
