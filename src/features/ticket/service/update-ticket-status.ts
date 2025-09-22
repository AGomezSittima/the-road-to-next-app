import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";

import { getTicket } from "../queries/get-ticket";

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
) => {
  const ticket = await getTicket(ticketId);

  if (!ticket || !ticket.isOwner) {
    throw new Error("Not authorized");
  }

  // TODO: Extract to DAL
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status,
    },
  });
};
