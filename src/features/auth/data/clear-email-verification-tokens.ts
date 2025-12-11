import { prisma } from "@/lib/prisma";

export const clearEmailVerificationTokens = async (
  userId: string,
) => {
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });
};
