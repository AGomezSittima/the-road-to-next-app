import { prisma } from "@/lib/prisma";

export const clearSessions = async (userId: string) => {
  await prisma.session.deleteMany({ where: { userId } });
};
