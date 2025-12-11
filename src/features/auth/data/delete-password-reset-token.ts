import { prisma } from "@/lib/prisma";

export const deletePasswordResetToken = async (tokenHash: string) => {
  await prisma.passwordResetToken.delete({
    where: { tokenHash },
  });
};
