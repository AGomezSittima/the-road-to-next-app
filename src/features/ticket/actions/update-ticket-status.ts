"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/utils/path";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { TicketStatus } from "@prisma/client";

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
) => {
  try {
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
