import { prisma } from "@/lib/prisma";

export const getReferencedTickets = async (ticketId: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      referencedTickets: true,
    },
  });

  return ticket?.referencedTickets ?? [];
};
