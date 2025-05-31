"use server";

import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getTicketPermissions } from "@/features/permissions/queries/get-ticket-permissions";
import { prisma } from "@/lib/prisma";

export const getTicket = async (ticketId: string) => {
  const { user } = await getAuth();

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      user: { select: { username: true } },
    },
  });

  if (!ticket) return null;

  const isTicketOwner = isOwner(user, ticket);
  const permissions = await getTicketPermissions({
    organizationId: ticket.organizationId,
    userId: user?.id,
  });

  return {
    ...ticket,
    isOwner: isTicketOwner,
    permissions: {
      canDeleteTicket: isTicketOwner && !!permissions.canDeleteTicket,
    },
  };
};
