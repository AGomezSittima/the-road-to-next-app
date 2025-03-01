"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { setCookieByKey } from "@/actions/cookies";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { ticketsPath } from "@/utils/path";

export const deleteTicket = async (ticketId: string) => {
  await prisma.ticket.delete({ where: { id: ticketId } });

  revalidatePath(ticketsPath());

  await setCookieByKey(appConfig.cookiesKeys.toast, "Ticket deleted");
  redirect(ticketsPath());
};
