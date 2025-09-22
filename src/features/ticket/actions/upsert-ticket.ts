"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { appConfig } from "@/utils/app-config";
import { ticketsPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import * as ticketService from "../service";

const upsertTicketSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Is required" })
    .max(191, { message: "Too many characters (max 191 characters)" }),
  content: z
    .string()
    .min(1, { message: "Is required" })
    .max(1024, { message: "Too many characters (max 1024 characters)" }),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Is required" }),
  bounty: z.coerce.number().positive(),
});

export const upsertTicket = async (
  ticketId: string | undefined,
  _actionState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const { user, activeOrganization } = await getAuthOrRedirect();

  try {
    const data = upsertTicketSchema.parse(Object.fromEntries(formData));

    await ticketService.upsertTicket(
      user.id,
      activeOrganization!.id,
      ticketId,
      data,
    );
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPath());

  if (ticketId) {
    await setCookieByKey(appConfig.cookiesKeys.toast, "Ticket updated");
    redirect(ticketsPath());
  }

  return toActionState("SUCCESS", "Ticket created");
};
