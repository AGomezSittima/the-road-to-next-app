import { prisma } from "@/lib/prisma";

export const deleteEmailVerificationToken = async (id: string) => {
  await prisma.emailVerificationToken.delete({
    where: { id },
  });
};
