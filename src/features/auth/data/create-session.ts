import { prisma } from "@/lib/prisma";
import { Session } from "@prisma/client";

export const createSession = async (session: Session) => {
  return await prisma.session.create({
    data: session,
  });
};
