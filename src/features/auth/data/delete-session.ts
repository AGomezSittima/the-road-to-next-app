import { prisma } from "@/lib/prisma";

export const deleteSession = async (sessionId: string) => {
  await prisma.session.delete({ where: { id: sessionId } });
};
