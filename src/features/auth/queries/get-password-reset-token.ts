import { prisma } from "@/lib/prisma";

export const getPasswordResetTokenByTokenHash = async (tokenHash: string) => {
  return await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
};
