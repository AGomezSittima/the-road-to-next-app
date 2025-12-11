import { prisma } from "@/lib/prisma";

export const getSession = async (sessionId: string) => {
  return await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });
};
