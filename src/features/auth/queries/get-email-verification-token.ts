import { prisma } from "@/lib/prisma";

export const getEmailVerificationTokenByUserId = async (userId: string) => {
  return prisma.emailVerificationToken.findFirst({
    where: {
      userId,
    },
  });
};
