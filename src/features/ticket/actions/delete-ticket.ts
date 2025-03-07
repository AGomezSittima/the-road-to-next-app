"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { setCookieByKey } from "@/actions/cookies";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { ticketsPath } from "@/utils/path";
import { fromErrorToActionState } from "@/utils/to-action-state";

export const deleteTicket = async (ticketId: string) => {
  try {
    await prisma.ticket.delete({ where: { id: ticketId } });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  await setCookieByKey(appConfig.cookiesKeys.toast, "Ticket deleted");
  redirect(ticketsPath());
};
