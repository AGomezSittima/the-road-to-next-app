import { prisma } from "@/lib/prisma";

export const connectReferencedTickets = async (
  ticketId: string,
  referencedTicketIds: {
    id: string;
  }[],
) => {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      referencedTickets: {
        connect: referencedTicketIds,
      },
    },
  });
};
