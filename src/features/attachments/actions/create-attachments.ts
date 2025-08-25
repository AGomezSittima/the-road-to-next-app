"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

const createAttachmentsSchema = z.object({
  files: z.custom<FileList>((files) => Array.from(files)),
});

export const createAttachments = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    return toActionState("ERROR", "Ticket not found");
  }

  if (!isOwner(user, ticket)) {
    return toActionState("ERROR", "Not the owner of the ticket");
  }

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // TODO: upload to s3
      // TODO: create a database reference to S3 file
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Attachment(s) uploaded");
};
