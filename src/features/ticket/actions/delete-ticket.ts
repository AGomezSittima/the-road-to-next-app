"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { setCookieByKey } from "@/actions/cookies";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { appConfig } from "@/utils/app-config";
import { ticketsPath } from "@/utils/paths";
import { fromErrorToActionState } from "@/utils/to-action-state";

import * as ticketService from "../service";

export const deleteTicket = async (ticketId: string) => {
  const { user } = await getAuthOrRedirect();

  try {
    await ticketService.deleteTicket(user.id, ticketId);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());

  await setCookieByKey(appConfig.cookiesKeys.toast, "Ticket deleted");

  redirect(ticketsPath());
};
