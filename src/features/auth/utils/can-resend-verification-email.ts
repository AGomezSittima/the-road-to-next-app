import { differenceInSeconds } from "date-fns";

import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

export const canResendVerificationEmail = async (userId: string) => {
  const databaseCode = await prisma.emailVerificationToken.findFirst({
    where: {
      userId,
    },
  });

  if (!databaseCode) {
    return true;
  }

  const diff = differenceInSeconds(
    new Date(),
    new Date(databaseCode.createdAt),
  );

  return diff > appConfig.emailVerification.emailResendIntervalInSeconds;
};
