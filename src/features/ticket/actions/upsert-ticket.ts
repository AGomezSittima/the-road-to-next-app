"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { toCent } from "@/utils/currency";
import { ticketsPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

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
  const { user } = await getAuthOrRedirect();

  try {
    if (ticketId) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket || !isOwner(user, ticket))
        return toActionState("ERROR", "Not authorized");
    }

    const data = upsertTicketSchema.parse(Object.fromEntries(formData));

    const dbData = {
      ...data,
      userId: user.id,
      bounty: toCent(data.bounty),
    };

    await prisma.ticket.upsert({
      where: {
        id: ticketId || "",
      },
      update: dbData,
      create: dbData,
    });
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
