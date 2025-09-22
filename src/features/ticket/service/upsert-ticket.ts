import { prisma } from "@/lib/prisma";
import { toCent } from "@/utils/currency";

import { getTicket } from "../queries/get-ticket";

export const upsertTicket = async (
  userId: string,
  activeOrganizationId: string,
  ticketId: string | undefined,
  data: {
    title: string;
    content: string;
    deadline: string;
    bounty: number;
  },
) => {
  if (ticketId) {
    const ticket = await getTicket(ticketId);

    if (!ticket || !ticket.isOwner) {
      throw new Error("Not authorized");
    }

    if (!ticket.permissions.canUpdateTicket) {
      throw new Error("Not authorized");
    }
  }

  const dbData = {
    ...data,
    userId,
    bounty: toCent(data.bounty),
  };

  // TODO: Extract to DAL
  await prisma.ticket.upsert({
    where: {
      id: ticketId || "",
    },
    update: dbData,
    create: { ...dbData, organizationId: activeOrganizationId },
  });
};
