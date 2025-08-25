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

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_IN_MB } from "../constants";
import { sizeInMB } from "../utils/size";

const createAttachmentsSchema = z.object({
  files: z
    .custom<FileList>()
    .transform((files) => Array.from(files))
    .transform((files) => files.filter((file) => file.size > 0))
    .refine(
      (files) =>
        files.every((file) => sizeInMB(file.size) <= MAX_FILE_SIZE_IN_MB),
      `The maximum file size is ${MAX_FILE_SIZE_IN_MB}MB`,
    )
    .refine((files) =>
      files.every(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        "File type is not supported",
      ),
    )
    .refine((files) => files.length !== 0, "File is required"),
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
