import { Ticket } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getTicket = async (
  ticketId: Ticket["id"],
): Promise<Ticket | null> => {
  return await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });
};
