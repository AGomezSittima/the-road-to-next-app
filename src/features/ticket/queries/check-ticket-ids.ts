import { prisma } from "@/lib/prisma";

export const checkTicketIds = async (ticketIds: string[]) => {
  return await prisma.ticket.findMany({
    where: { id: { in: ticketIds } },
    select: { id: true },
  });
};
