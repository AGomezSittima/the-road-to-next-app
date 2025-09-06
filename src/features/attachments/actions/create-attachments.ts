"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { AttachmentEntity } from "@prisma/client";

import { filesSchema } from "../schema/files";
import * as attachmentService from "../service";

const createAttachmentsSchema = z.object({
  files: filesSchema.refine((files) => files.length !== 0, "File is required"),
});

type CreateAttachmentsArgs = {
  entity: AttachmentEntity;
  entityId: string;
};

export const createAttachments = async (
  { entity, entityId }: CreateAttachmentsArgs,
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  const subject = await attachmentService.getAttachmentSubject({
    entity,
    entityId,
  });

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not authorized");
  }
  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    await attachmentService.createAttachments({
      subject,
      entity,
      entityId,
      files,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(subject.ticketId);

  return toActionState("SUCCESS", "Attachment(s) uploaded");
};
