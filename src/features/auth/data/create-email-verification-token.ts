import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

export const createEmailVerificationToken = async (
  userId: string,
  email: string,
  code: string,
) => {
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
};
