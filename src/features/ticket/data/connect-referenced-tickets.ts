import { prisma } from "@/lib/prisma";

export const connectReferencedTickets = async (
  ticketId: string,
  referencedTicketIds: string[],
) => {
  const ticketIds = await prisma.ticket.findMany({
    where: { id: { in: referencedTicketIds } },
    select: { id: true },
  });

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      referencedTickets: {
        connect: ticketIds,
      },
    },
  });
};
