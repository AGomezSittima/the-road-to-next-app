"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/utils/path";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { TicketStatus } from "@prisma/client";

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
) => {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || !isOwner(user, ticket))
      return toActionState("ERROR", "Not authorized");

    await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());

  return toActionState("SUCCESS", "Status updated");
};
