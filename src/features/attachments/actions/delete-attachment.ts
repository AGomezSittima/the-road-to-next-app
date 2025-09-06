"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { ticketPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import * as attachmentData from "../data";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  const attachment = await attachmentData.getAttachmentById(id);

  const subject = AttachmentSubjectDTO.fromAttachment(attachment);

  if (!subject || !attachment) {
    return toActionState("ERROR", "Not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    await prisma.attachment.delete({
      where: { id },
    });

    await inngest.send({
      name: appConfig.events.names.attachmentDeleted,
      data: {
        organizationId: subject.organizationId,
        entity: attachment.entity,
        entityId: subject.entityId,
        fileName: attachment.name,
        attachmentId: id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(id));

  return toActionState("SUCCESS", "Attachment deleted");
};
