import { prisma } from "@/lib/prisma";

export const deleteSessions = async (userId: string) => {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
};
