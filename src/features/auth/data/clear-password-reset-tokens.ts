import { prisma } from "@/lib/prisma";

export const clearPasswordResetTokens = async (userId: string) => {
  await prisma.passwordResetToken.deleteMany({ where: { userId } });
};
