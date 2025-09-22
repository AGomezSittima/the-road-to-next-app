"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ticketsPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { TicketStatus } from "@prisma/client";

import * as ticketService from "../service";

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
) => {
  await getAuthOrRedirect();

  try {
    await ticketService.updateTicketStatus(ticketId, status);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());

  return toActionState("SUCCESS", "Status updated");
};
