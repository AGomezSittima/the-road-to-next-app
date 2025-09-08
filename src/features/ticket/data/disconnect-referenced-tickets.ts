import { prisma } from "@/lib/prisma";

export const connectReferencedTickets = async (
  ticketId: string,
  referencedTicketIds: string[],
) => {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      referencedTickets: {
        connect: referencedTicketIds.map((id) => ({
          id,
        })),
      },
    },
  });
};
