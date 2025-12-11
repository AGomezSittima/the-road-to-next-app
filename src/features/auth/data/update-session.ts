import { prisma } from "@/lib/prisma";

export const updateSession = async (id: string, expiresAt: Date) => {
  await prisma.session.update({
    where: {
      id,
    },
    data: {
      expiresAt,
    },
  });
};
