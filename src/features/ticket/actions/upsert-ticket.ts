"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/to-action-state";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";

const upsertTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
});

export const upsertTicket = async (
  ticketId: string | undefined,
  _actionState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const data = upsertTicketSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
    });

    await prisma.ticket.upsert({
      where: {
        id: ticketId || "",
      },
      update: data,
      create: data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPath());

  if (ticketId) redirect(ticketsPath());

  return toActionState("SUCCESS", "Ticket created");
};
